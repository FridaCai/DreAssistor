import SubProject from './subproject.js';
import Util from '../../../util.js';


module.exports = class Project {
	constructor(){
		//by default, exist mastertiming and ais development.
		var mastertiming = new SubProject();
		mastertiming.init({label: 'Master Timing'});

		var aisdevelopment = new SubProject();
		aisdevelopment.init({label: 'AIS Development'});

		this.children = [mastertiming, aisdevelopment];
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.creatorId=param.creatorId;
		
		this.label = param.label;
		this.ec = param.ec;
		this.bpmin = param.bpmin;
		this.bpmax = param.bpmax;
		this.sorp = param.sorp || 0;
		this.children = [];
		param.children && param.children.map((function(sp, index){
			


			var subproject = new SubProject();
			subproject.init(sp);

			subproject.setParent(this);
			this.children.push(subproject);
		}).bind(this));
	}
	setParent(parent){
		this.parent = parent;
	}

	/**
	** suppose only project property and tags are allowed to update. if user want to update task, use another UI.
	**/
	_updateMeta(param){
		this.label = param.label;
		this.ec = param.ec;
		this.bpmin = param.bpmin;
		this.bpmax = param.bpmax;
		this.sorp = param.sorp;

		var tagObjs = param.children[0].children;
		for(var i=0; i<tagObjs.length; i++){
			var tagObj = tagObjs[i];

			var tag = this.children[0].children[i];
			tag.update(tagObj);
		}
	}

	update(param){
		this._updateMeta(param);
	}

	findChildByIndex(index){
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

	clearTags(){
		this.children[0].clearTags();
	}

	addTag(tag){
		this.children[0].addChild(tag);
	}
	getTags(handler){
		return this.children[0].getTags(handler);
	}

	dump(){
		var children = [];
		this.children.map(function(child){
			children.push(child.dump());
		});

		return {
			id: this.id,
			label: this.label,
			creatorId: this.creatorId,
			sorp: this.sorp,
			ec: this.ec,
			bpmin: this.bpmin,
			bpmax: this.bpmax,
			children: children,
			comment: `sorp: ${new Date(this.sorp)}`
		};
	}
}