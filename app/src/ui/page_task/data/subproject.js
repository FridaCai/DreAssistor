import Task from './task.js';
import Tag from './tag.js';
import Util from '../../../util.js';

module.exports = class SubProject {
	constructor(){
	}

	init(param){
		this.id = param.id || Util.generateUUID();
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
			child.setParent(this);
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

	findTasks(condition){
		return this.children.filter(function(task){
			if(!(task instanceof Task)){
				return false;
			}

			return task.meetCondition(condition);
		})
	}


	hasTask(condition){
		return this.findTasks(condition).length === 0 ? false: true;
	}

	clearTags(){
		this.children = [];
	}

	//filter/order.
	getTags(orderHandler){
		this.children.sort(orderHandler);
		return this.children;
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