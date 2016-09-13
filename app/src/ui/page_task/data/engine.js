import Util from 'Util';
import {SingleParam} from './template/mix.js';
import {MultipleParam} from './template/mix.js';
module.exports = class Engine{
	static create(param){
		var engine = new Engine();
		engine.init(param);
		return engine;
	}

	constructor(){

	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.properties = MultipleParam.create(param.properties);
	}
	clone(){
		var param = this.dump();
		return Engine.create(param);
	}

	
	setParent(parent){
		this.parent = parent;
	}

	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
			properties: this.properties.dump()
		}
	}
}
