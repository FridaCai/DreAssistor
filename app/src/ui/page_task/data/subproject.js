import Task from './task.js';
import Tag from './tag.js';

module.exports = class SubProject {
	constructor(){
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.parent = undefined;


		this.children = [];
		param.children && param.children.map((function(c){
			var child;
			if(c.class === 'Tag'){
				child = new Tag();
			}else if(c.class === 'Task'){
				child = new Task();
			}
			child.init(c);
			this.children.push(child);
		}).bind(this));
	}

	addChild(child){
		this.children.unshift(child);
		child.setParent(this);
	}

	setParent(parent){
		this.parent = parent;
	}

	dump(){
		var children = [];
		this.children.map(function(child){
			children.push(child.dump());
		})
		return {
			id: this.id,
			label: this.label,
			children: children
		}

	}
}