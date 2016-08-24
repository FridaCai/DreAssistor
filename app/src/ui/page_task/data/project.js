import SubProject from './subproject.js';
import Util from 'Util';
import {SingleParam} from './template/mix.js';
import {MultipleParam} from './template/mix.js';
import {Engines} from './engines';

module.exports = class Project{
	constructor(){

		//by default, exist mastertiming and ais development.
		/*var mastertiming = new SubProject();
		mastertiming.init({label: 'Master Timing'});

		var aisdevelopment = new SubProject();
		aisdevelopment.init({label: 'AIS Development'});

		this.children = [mastertiming, aisdevelopment];*/
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.creatorId=param.creatorId;
		this._updateMeta(param);
	}

	setParent(parent){
		this.parent = parent;
	}

	/**
	** suppose only project property and tags are allowed to update. if user want to update task, use another UI.
	**/
	_updateMeta(param){
		this.label = SingleParam.create(param.label);
		this.sorp = SingleParam.create(param.sorp);
		this.platform = SingleParam.create(param.platform)
		this.bodyStyle = SingleParam.create(param.bodyStyle);
		this.engines = Engines.create(param.engines);

		this.children = [];
		param.children && param.children.map((function(sp, index){
			var subproject = new SubProject();

			if(index === 0){
				subproject.initTag(sp);	
			}else if(index === 1){
				subproject.initTask(sp);
			}
			
			subproject.setParent(this);
			this.children.push(subproject);
		}).bind(this));
	}
	addEngine(param){
		this.engines.addEngine(param);
	}
	deleteEngine(engine){
		this.engines.deleteEngine(engine);
	}
	copyEngine(engine){
		this.engines.copyEngine(engine);
	}

	update(param){
		this._updateMeta(param);
	}

	findChildByIndex(index){
		return this.children[index];
	}

	getTasks(handler){
		return this.children[1].getChildren(handler);
	}
	findTasks(condition){
		var tasks = [];
		this.children.map(function(sp){
			tasks = tasks.concat(sp.findTasks(condition));
		})
		return tasks;
	}
	hasTask(condition){
		return this.findTasks(condition).length === 0 ? false: true;
	}

	addTask(task){
		this.children[1].addChild(task);
	}
	clearTags(){
		this.children[0].clearChildren();
	}
	clearTasks(){
		this.children[1].clearChildren();
	}
	addTag(tag){
		this.children[0].addChild(tag);
	}
	getTags(handler){
		return this.children[0].getChildren(handler);
	}

	dump(){
		var children = [];
		this.children.map(function(child){
			children.push(child.dump());
		});
	
		return {
			id: this.id,
			creatorId: this.creatorId,

			label: this.label.dump(),
			sorp: this.sorp.dump(),
			platform: this.platform.dump(),
			bodyStyle: this.bodyStyle.dump(),
			engines: this.engines.dump(),


			children: children,
			//comment: `sorp: ${new Date(this.sorp)}`
		};
	}
}