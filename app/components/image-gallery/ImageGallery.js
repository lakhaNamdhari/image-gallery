
/* Class ImageGallery
*
*	Description: Its is used to create an Image Gallery component which has capability
*	to move forward and backward in the Image list.
*/

import bootstrap from '../../scripts/bootstrap';
import SwipeEvents from '../../scripts/swipeEvents.js';
import ImageGalleryStyles from './imageGallery.css';

class ImageGallery{
	constructor(config){
		var swipeEvents;

		this.config = config || {};
		if (this.config.url === undefined){
			throw('ImageGallery: URL is required to create image gallery.');
		}
		this.cssClass = {
			active: 'active',
			left: 'left',
			right: 'right'
		}
		this.transitionDuration = this.config.transitionDuration || 600;
		swipeEvents = new SwipeEvents(this.config.el);
		swipeEvents.initialize();
		this.browserPrefixes = ["webkit", "moz", "MS", "o", ""];
		this.istransitionInProgress = false;
		this.minIndex = 0;

		// exclusively bind scope to protect it during execution.
		this.render = this.render.bind(this)
		this.updateImage = this.updateImage.bind(this);
		this.updateGalleryState = this.updateGalleryState.bind(this);
	}

	// Inits the execution sequence
	initialize(){
		this.bindEvents();
		this.fetchData(this.render);
	}

	// Bind all events for this component
	bindEvents(){
		this.config.el.addEventListener('click', this.updateImage);
		this.config.el.addEventListener('swipe', this.updateImage);
		this.browserPrefixes.forEach((prefix, index) => {
			var eventType = 'TransitionEnd';
			
			if(!prefix.length){
				eventType = eventType.toLowerCase();
			}
			this.config.el.addEventListener(prefix+eventType, this.updateGalleryState);
		});
	}

	// Fetches data from service and executes callback
	fetchData(callback){
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('load', (e) => {
			try{
				this.imageListData = JSON.parse(e.currentTarget.response);
			}catch(e){
				throw('ImageGallery: Please check the service response');
			}
      this.maxIndex = this.imageListData.length - 1;
		  if (typeof callback === 'function'){
    		callback();
    	}
		});
		ajax.open("GET", this.config.url);
		ajax.send();
	}

	// Updates image in the gallery when next or prev buttons is clicked
	updateImage(e){
		var dx;
		
		e.preventDefault();
		// 1. This ensures that we dont update image in gallery when a transition is in-progress
		// 2. It also ensures that if transitionend event wasnt triggered we update the state manually
		if (this.istransitionInProgress){
			if (Date.now() - this.timeStart > this.transitionDuration){
				this.updateGalleryState();
			}else{
				return false;
			}
		}

		if (/next|prev/.test(e.target.className) || e.type === 'swipe'){
			this.nxtIndex = this.currIndex;
			if (e.type === 'swipe'){
				dx = /left/.test(e.detail) ? 1 : -1;
			}else{
				dx = /next/.test(e.target.className) ? 1 : -1;
			}
			this.nxtIndex += dx;

			if (this.nxtIndex < this.minIndex){
				this.nxtIndex = this.maxIndex;
			}else if (this.nxtIndex > this.maxIndex){
				this.nxtIndex = this.minIndex;
			}

			this.imageListEls[this.currIndex].className = (dx === 1) ? this.cssClass.left : this.cssClass.right;
			this.imageListEls[this.nxtIndex].className = (dx === 1) ? this.cssClass.right : this.cssClass.left;		
			// To trigger transition, there needs to be some latency between two states 
			setTimeout(() => this.imageListEls[this.nxtIndex].className = this.cssClass.active, 10);
			this.istransitionInProgress = true;
			this.timeStart = Date.now();
		}
	}

	// Updates component state after transition finishes
	updateGalleryState(e){
		if ((!e || e.target === this.imageListEls[this.nxtIndex]) && this.istransitionInProgress){
			this.imageListEls[this.currIndex].className = '';
			this.currIndex = this.nxtIndex;
			this.indicator.innerText = this.currIndex + 1;
			this.istransitionInProgress = false;
		}
	}

	// cache DOM references
	updateDomRefs(){
		this.imageListEls = this.config.el.querySelectorAll('ul li');
		this.indicator = this.config.el.querySelector('.image-indicator span:first-child');
	}

	// Renders component on page
	render(){
		var imageListMarkup = this.imageListData.map((imageObject, index) => {
			var activeClass;

			if (imageObject.isActive){
				activeClass = this.cssClass.active;
				this.currIndex = index;
			}else{
				activeClass = '';
			}
			return `
				<li class="${activeClass}">
					<img alt="${imageObject.image.alt}" src="${imageObject.image.src}" srcset="${imageObject.image.srcset}" sizes="${imageObject.image.sizes}"/>
				</li>
			`;
		}).join('');

		this.config.el.innerHTML = `
			<a href="#" class="prev">&lt;</a>
			<ul>${imageListMarkup}</ul>
			<a href="#" class="next">&gt;</a>
			<div class="image-indicator">
				<span>${this.currIndex + 1}</span><span> / ${this.imageListData.length}</span>
			</div>
		`;
		this.updateDomRefs();
	}
}

bootstrap.add('ImageGallery', () => {
	var els = document.querySelectorAll('[data-image-gallery]');

	Array.prototype.forEach.call(els, (el, index) => {
		var config, instance;

		try{
			config = JSON.parse(el.dataset.imageGallery);
		}catch(e){
			config = {};
		}
		config.el = el;
		instance = new ImageGallery(config);
		instance.initialize();
		el.dataset.instanceImageGallery = instance;
	});
});

export default ImageGallery;