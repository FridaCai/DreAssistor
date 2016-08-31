import Tag from './tag.js';

module.exports = class Tags extends Array{
	static create(param){
		var tags = new Tags();
		tags.init(param);
		return tags;
	}
	setParent(parent){
		this.parent = parent;
	}
	constructor(){
		super();
	}

	init(param){
		param.map((function(tag){
			var tag = Tag.create(tag);
			tag.setParent(this);
			this.push(tag);
		}).bind(this))
	}
	getChildren(handler){
		this.sort(handler);
		return this;
	}
	dump(){
		return this.map(function(tag){
			return tag.dump();
		})
	}
	addChild(tag){
		this.unshift(tag);
	}
	clearChildren(){
		this.length = 0;
	}
}

