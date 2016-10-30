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
	update(param){
		this._updateMeta(param);
	}
	_updateMeta(param){
		if(param.properties){
			this.properties = MultipleParam.create(param.properties);	
		}
	}
	init(param){
		this.id = param.id || Util.generateUUID();
		this._updateMeta(param);
	}
	getLabel(){
		if(this.properties){
			var property = this.properties.findSingleParamByKey('PROJECT.ENGINE.LABEL');
			return property.text;	
		}else{
			return '';
		}
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
			properties: this.properties ? this.properties.dump(): undefined,
		}
	}
}
