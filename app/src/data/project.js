import Util from 'Util';
import {SingleParam} from './template/mix.js';

import Tags from './tags.js';
import Tasks from './tasks.js';
import Properties from './properties.js';
import Engines from './engines.js';

module.exports = class Project{
	static create(param){
		var project = new Project();
		project.init(param);
		return project;
	}
	constructor(){
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		
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
		this.creatorId = param.creatorId;

		if(param.tags){
			this.tags = Tags.create(param.tags);
			this.tags.setParent(this);
		}
		
		if(param.tasks){
			this.tasks = Tasks.create(param.tasks);
			this.tasks.setParent(this);	
		}

		if(param.properties){
			this.properties = Properties.create(param.properties);
		}

		if(param.engines){
			this.engines = Engines.create(param.engines);
		}
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

	

	hasTask(condition){
		return this.findTasks(condition).length === 0 ? false: true;
	}

	
	*/

	findTasks(){
		return this.tasks;
	}
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

	forEachTask(cb){
		return this.tasks.map(function(task){
			return cb(task);
		})
	}
	forEachEngine(cb){
		return this.engines.map(function(engine){
			return cb(engine);
		})
	}
	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
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