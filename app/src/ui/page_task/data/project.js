import SubProject from './subproject.js';
import Util from 'Util';
import {SingleParam} from './template/mix.js';
import {MultipleParam} from './template/mix.js';
import {Engines} from './engines';

import Tags from './tags.js';
import Tasks from './tasks.js';

module.exports = class Project{
	constructor(){
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
		this.label = param.label;
		this.sorp = param.sorp;

		//todo:
		/*
		this.platform = SingleParam.create(param.platform)
		this.bodyStyle = SingleParam.create(param.bodyStyle);
		this.engines = Engines.create(param.engines);*/
		this.properties = param.properties.map(function(){

		})


		//todo: engine.




		this.tags = Tags.create(param.tags);
		this.tags.setParent(this);
		this.tasks = Tasks.create(param.tasks);
		this.tasks.setParent(this);

		
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

	/*findChildByIndex(index){
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
	}*/

	dump(){
		return {
			id: this.id,
			creatorId: this.creatorId,

			label: this.label.dump(),
			sorp: this.sorp.dump(),
			platform: this.platform.dump(),
			bodyStyle: this.bodyStyle.dump(),
			engines: this.engines.dump(),


			tags: this.tags.dump(),
			tasks: this.tasks.dump()
			//comment: `sorp: ${new Date(this.sorp)}`
		};
	}
}