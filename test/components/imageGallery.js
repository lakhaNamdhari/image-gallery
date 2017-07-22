
import ImageGallery from '../../app/components/image-gallery/imageGallery.js';
import {expect} from 'chai';
import sinon from 'sinon';

describe('ImageGallery component', function(){
	var el, imageGallery;

	var fakeResponse = JSON.parse(`
		[
			{
				"isActive": true,
				"image": {
			    "alt": "sample 1",
			    "src": "http://lorempixel.com/320/180",
			    "srcset": "http://lorempixel.com/320/180 320w, http://lorempixel.com/640/360 640w, http://lorempixel.com/960/540 960w, http://lorempixel.com/1280/720 1280w",
			    "sizes": "100vw"
				}
			},				
			{
				"isActive": false,
				"image": {
			    "alt": "sample 1",
			    "src": "http://lorempixel.com/320/180",
			    "srcset": "http://lorempixel.com/320/180 320w, http://lorempixel.com/640/360 640w, http://lorempixel.com/960/540 960w, http://lorempixel.com/1280/720 1280w",
			    "sizes": "100vw"
				}
			},	
			{
				"isActive": false,
				"image": {
			    "alt": "sample 2",
			    "src": "http://via.placeholder.com/320x180",
			    "srcset": "http://via.placeholder.com/320x180 320w, http://via.placeholder.com/640x360 640w, http://via.placeholder.com/960x540 960w, http://via.placeholder.com/1280x720 1280w",
			    "sizes": "100vw"
				}
			}
		]`);

	beforeEach(function(){
		el = document.createElement('div');
		el.className = 'image-gallery';
		document.body.appendChild(el);
		imageGallery = new ImageGallery({
			el: el,
			url: '../../app/services/image-gallery.json'
		});
		sinon.stub(imageGallery, 'fetchData', function(callback){
			imageGallery.imageListData = fakeResponse;
			imageGallery.maxIndex = fakeResponse.length - 1;
			callback();
		});
	});

	it('should render when initialized', function(){
		sinon.spy(imageGallery, 'render');
		imageGallery.initialize();
		expect(imageGallery.render.calledOnce).to.equal(true);
	});	

	it('should show next image when next putton is clicked', function(){
		var nextButton;
		var clickEvent = new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		});

		imageGallery.initialize();
		nextButton = el.querySelector('.next');
		// Validate initial index
		expect(imageGallery.currIndex).to.equal(0);
		//emulate button click
		nextButton.dispatchEvent(clickEvent);
		// fast forward animations
		imageGallery.updateGalleryState();
		expect(imageGallery.currIndex).to.equal(1);
	});

	it('should show previous image when prev putton is clicked', function(){
		var prevButton;
		var clickEven = new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		});

		imageGallery.initialize();
		prevButton = el.querySelector('.prev');console.log(prevButton);
		// Validate initial index
		expect(imageGallery.currIndex).to.equal(0);
		//emulate button click
		prevButton.dispatchEvent(clickEven);
		// fast forward animations
		imageGallery.updateGalleryState();
		expect(imageGallery.currIndex).to.equal(imageGallery.imageListData.length - 1);
	});

	it('should update indicator value when image in gallery is updated', function(){
		var prevButton, imageIndicator;
		var clickEven = new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		});

		imageGallery.initialize();
		imageIndicator = el.querySelector('.image-indicator span:first-child');
		prevButton = el.querySelector('.prev');console.log(prevButton);
		// Validate initial indicator value
		expect(parseInt(imageIndicator.innerText)).to.equal(1);
		//emulate button click
		prevButton.dispatchEvent(clickEven);
		// fast forward animations
		imageGallery.updateGalleryState();
		expect(parseInt(imageIndicator.innerText)).to.equal(imageGallery.imageListData.length);
	});

	afterEach(function(){
		document.body.removeChild(el);
		imageGallery = null;
	});
});