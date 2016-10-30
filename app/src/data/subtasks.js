import Subtask from './subtask.js';

module.exports = class Subtasks extends Array{
	static create(param){
		var sts = new Subtasks();
		sts.init(param);
		return sts;
	}

	constructor(){
		super();
	}

	init(params){
		params && params.map((function(param){
			var st = Subtask.create(param);
			super.push(st);
		}).bind(this))
	}

	dump(){
		return super.map(function(st){
			return st.dump();
		})
	}
	add(st){
		super.unshift(st);
	}
	deleteById(id){
		var index = -1;
		for(var i=0; i<this.length; i++){
			var st = this[i];
			if(st.id === id){
				index = i;
				break;
			}
		}
		this.splice(index, 1);
	}

	findById(id){
		return this.find(function(subtask){
			return id === subtask.id;
		})
	}
}