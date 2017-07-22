
/* Class ImageGallery
*
*	Description: Its is used to create an Image Gallery component which has capability
*	to move forward and backward in the Image list.
*/

import bootstrap from '../../scripts/bootstrap';
import ImageGalleryStyles from './ImageGallery.css';

class ImageGallery{
	constructor(config){
		this.config = config || {};
		if (this.config.url === undefined){
			throw('ImageGallery: URL is required to create image gallery.');
		}
		this.cssClass = {
			active: 'active',
			left: 'left',
			right: 'right'
		}
		this.minIndex = 0;

		// exclusively bind scope to protect it during execution.
		this.render = this.render.bind(this)
	}

	// Inits the execution sequence
	initialize(){
		this.fetchData(this.render);
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