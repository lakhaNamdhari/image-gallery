
/** Component responsible to initialize all components on a page */

class Bootstrap{
	constructor(){
		this.components = {};
	}

	// Add component to the execute queue
	add(name, initialize){
		this.components[name] = initialize;
	}

	// initializes all components on a page
	execute(){
		var component;

		for (component in this.components){
			this.components[component]();
		}
	}
}

export default new Bootstrap();