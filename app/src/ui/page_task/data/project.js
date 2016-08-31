import SubProject from './subproject.js';
import Util from 'Util';
import {SingleParam} from './template/mix.js';

import Tags from './tags.js';
import Tasks from './tasks.js';
import Properties from './properties.js';
import {Engines} from './engines.js';

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
	setCreator(creator){
		this.creatorId = creator.id;
	}

	/**
	** suppose only project property and tags are allowed to update. if user want to update task, use another UI.
	**/
	_updateMeta(param){
		this.label = param.label;
		this.sorp = param.sorp;

		this.tags = Tags.create(param.tags);
		this.tags.setParent(this);
		this.tasks = Tasks.create(param.tasks);
		this.tasks.setParent(this);

		this.properties = Properties.create(param.properties);
		this.engines = Engines.create(param.engines);
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

	
	*/
	addTask(task){
		this.tasks.addChild(task);
	}

	addTag(tag){
		this.tags.addChild(tag);
	}
	clearTags(){
		this.tags.clearChildren();
	}
	clearTasks(){
		this.tasks.clearChildren();
	}

	getTasks(handler){
		return this.tasks.getChildren(handler);
	}

	getTags(handler){
		return this.tags.getChildren(handler);
	}

	dump(){
		return {
			id: this.id,
			creatorId: this.creatorId,
			label: this.label,
			sorp: this.sorp,
			properties: this.properties.dump(),
			engines: this.engines.dump(),
			tags: this.tags.dump(),
			tasks: this.tasks.dump()
			//comment: `sorp: ${new Date(this.sorp)}`
		};
	}
}