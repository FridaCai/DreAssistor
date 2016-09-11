import Subtasks from './subtasks.js';
import Attachments from './attachments.js';
import Util from 'Util';
import TemplateFactory from './template/factory';

module.exports = class Task {
	static create(param){
		var task = new Task();
		task.init(param);
		return task;
	}
	constructor(){
	}
	meetCondition(condition){
		if(!condition)
			return true;
		
		return (Util.getValue(this, condition.key) === condition.value);
	}
	init(param){
		this.id = param.id || Util.generateUUID();
		this.creatorId = param.creatorId;
		this.parent = undefined;
		this._updateMeta(param);
	}

	week2time(ref){
		this.startTime = parseInt(moment(ref).subtract(this.startWeek, 'week').format('x'));
		this.endTime = parseInt(moment(ref).subtract(this.endWeek, 'week').format('x'));
	}
	time2week(ref){
		this.startWeek = moment(ref).diff(moment(this.startTime), 'w');
		this.endWeek = moment(ref).diff(moment(this.endTime), 'w');
	}

	/**
	 * for parameters that can be update through popup panel;
	**/
	_updateMeta(param){
		this.label = param.label;
		this.startTime=param.startTime;
		this.endTime = param.endTime;
		this.desc = param.desc || '';
		this.exp = param.exp || '';
		this.markColor = param.markColor || 6076508;
		this.priority = param.priority || 0;
		this.privacy = param.privacy || 0;
		this.attachments = Attachments.create(param.attachment);
		this.subtasks = Subtasks.create(param.subtask);
		this.template = param.template ? TemplateFactory.create(param.template): undefined;	

		//todo: bad.
		/*this.statical = (function(templateType){
			var returnValue = ['duration'];
 			switch(templateType){
 				case 0: //normal
				case 1: //ewo
				case 2: //hot issue
				case 4:
				case 5:
				case 6:
				case 7:
					return returnValue;
				case 3: //mule
					return returnValue.concat(["template.param.bp.value", "template.param.heavy.value", "template.param.snorkelNoiseXls"]);
 			}
		})(param.template.type);*/
		this.statical = ["duration"];



		/**
		** property used in spread sheet.
		**/
		this.startWeek = param.startWeek || 0;
		this.endWeek = param.endWeek || 0;

	}

	update(param){
		this._updateMeta(param);
	}

	
	
	
	setParent(parent){
		this.parent = parent;
	}


	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
			label: this.label,
			startTime: this.startTime,
			endTime: this.endTime,
			desc: this.desc,
			exp: this.exp,
			markColor: this.markColor,
			attachment: this.attachments.dump(),
			creatorId: this.creatorId,
			priority: this.priority,
			subtask: this.subtasks.dump(),
			privacy: this.privacy,
			template: this.template.dump(),
			statical: this.statical,

			startWeek: this.startWeek,
			endWeek: this.endWeek,

			comment: `startTime: ${new Date(this.startTime)}, endTime: ${new Date(this.endTime)}`,
		}
	}
}