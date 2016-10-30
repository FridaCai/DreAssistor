import Engine from './engine.js';
import ProjectTemplate from 'ProjectTemplate';
module.exports = class Engines extends Array{
	static create(param){
		var engines = new Engines();
		engines.init(param);
		return engines;
	}

	constructor(){
		super();
	}

	init(param){
		param.map((function(p){
			var engine = Engine.create(p);
			super.push(engine);
		}).bind(this))
	}

	dump(){
		return this.map(function(engine){
			return engine.dump()
		})
	}

	//engine; engine param; empty param.
	addEngine(param){
		var engine;
		if(!param){
			var EngineTemplate = ProjectTemplate.engines[0];
			engine = Engine.create(EngineTemplate);
		}else if(param instanceof Engine){
			engine = param;
		}else{
			engine = Engine.create(param);
		}
		this.unshift(engine);
	}
	deleteEngine(engine){
		var id = engine.id;
		var index = -1;
		for(var i=0; i<this.length; i++){
			var engine = this[i];
			if(engine.id === id){
				index = i;
				break;
			}
		}
		this.splice(index, 1);
	}
	copyEngine(engine){
		var cloneEngine = engine.clone();
		
		var keys = Object.keys(cloneEngine.properties);

		for(var i=0; i<keys.length; i++){
			var key = keys[i];
			var property = cloneEngine.properties[key];
			if(property.key === "PROJECT.ENGINE.LABEL"){
				property.text = `copy of ${property.text}`;
				break;		
			}
		}
		

		this.unshift(cloneEngine);
	}
	clear(){
		this.length = 0;
	}
}
