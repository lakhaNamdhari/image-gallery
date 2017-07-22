
/* Class SwipeEvents
*	Description: It triggers swipeleft and swiperight events on binded components
*/

import bootstrap from './bootstrap';

class SwipeEvents{
	constructor(el){
		this.el = el;
		
		if (this.el === undefined){
			throw('SwipeEvents: DOM element is required to bind swipe events.')
		}
	}

	// Inits the execution sequence
	initialize(){
		this.bindEvents();
	}

	// Bind all events for this component
	bindEvents(){
		this.el.addEventListener('touchstart', this.captureCordinates.bind(this));
		this.el.addEventListener('touchend', this.triggerSwipe.bind(this));
	}


	// Updates image in the gallary when next or prev buttons is clicked
	captureCordinates(e){
		this.xStart = Math.floor(e.changedTouches[0].clientX);
	}	

	// Updates image in the gallary when next or prev buttons is clicked
	triggerSwipe(e){
		var type;

		this.xEnd = Math.floor(e.changedTouches[0].clientX);
		if (this.xStart < this.xEnd){
			type = 'right';
		}else{
			type = 'left';
		}
		this.el.dispatchEvent(new CustomEvent('swipe', {detail: type}));
		this.xStart = this.xEnd = 0;
	}
}

bootstrap.add('SwipeEvents', () => {
	var els = document.querySelectorAll('[data-swipe-events]');

	Array.prototype.forEach.call(els, (el, index) => {
		var instance;

		instance = new SwipeEvents(el);
		instance.initialize();
		el.dataset.instanceSwipeEvents = instance;
	});
});

export default SwipeEvents;