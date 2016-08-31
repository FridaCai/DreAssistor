import SubTask from './subtask.js';
import {Attachments} from './attachments.js';
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


		var type = 0;
		var template = {
			sheetNames: [], sheets: []
		}
		if(param.template){
			type = param.template.type;
			template = (TemplateFactory.create(type)).init(param.template);
		}
		

		this.template = {
			type: type, 
			sheetNames: param.sheetNames, 
			sheets: param.sheets
		};



		

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
		this.attachments = param.attachments ? Attachments.create(param.attachments): param.attachments;



	
		


		this.subtasks = (function(subtasks){
			if(!subtasks)
				return [];

			return subtasks.map((function(subtask){
				var st = new SubTask();
				st.init(subtask);
				st.setParent(this);
				return st;
			}).bind(this));
		})(param.subtasks)

	}

	update(param){
		this._updateMeta(param);
	}

	findSubTask(id){
		return this.subtasks.find(function(subtask){
			return subtask.id === id;
		})
	}
	
	deleteSubTask(id){
		this.subtasks = this.subtasks.filter(function(subtask){
			return !(id === subtask.id);
		})
	}
	addSubTask(subtask){
		this.subtasks.unshift(subtask);
		subtask.setParent(this);
	}
	setParent(parent){
		this.parent = parent;
	}
	addAttachment(attachment){
		//upload file to s3
		this.attachments.unshift(attachment);
		attachment.setParent(this);
	}
	deleteAttachment(id){
		//remove file from s3
		this.attachments = this.attachments.filter(function(attachment){
			return !(id === attachment.id);
		})
	}

	dump(){
		var attachments = [];
		this.attachments && this.attachments.map(function(at){
			attachments.push(at.dump());
		})

		var subtasks = [];
		this.subtasks && this.subtasks.map(function(sp){
			subtasks.push(sp.dump());
		})
		
		return {
			id: this.id,
			label: this.label,
			startTime: this.startTime,
			endTime: this.endTime,
			desc: this.desc,
			exp: this.exp,
			markColor: this.markColor,
			attachments: attachments,
			creatorId: this.creatorId,
			priority: this.priority,
			subtasks: subtasks,
			privacy: this.privacy,
			template: { //todo: change temperarily for testing post/project fail.
				type: this.template.type,
				sheetNames: this.template.sheetNames,
				sheets: this.template.sheets
			},
			statical: this.statical,

			startWeek: this.startWeek,
			endWeek: this.endWeek,



			comment: `startTime: ${new Date(this.startTime)}, endTime: ${new Date(this.endTime)}`,
		}
	}
}