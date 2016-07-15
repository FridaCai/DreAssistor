import SubTask from './subtask.js';
import Attachment from './attachment.js';
import Util from '../../../util.js';

module.exports = class BaseTask {

	constructor(){
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.class = 'Task';
		this.creatorId = param.creatorId;
		this.parent = undefined;
		this.template = param.template;
		this.statical = (function(templateType){
			var returnValue = ['duration'];
 			switch(templateType){
 				case 0: //normal
				case 1: //ewo
				case 2: //hot issue
					return returnValue;
				case 3: //mule
					return returnValue.concat(["template.param.bp.value", "template.param.heavy.value", "template.param.snorkelNoiseXls"]);
 			}
		})(param.template.type);

		this._updateMeta(param);
	}

	/**
	 * for parameters that can be update through popup panel;
	**/
	_updateMeta(param){
		this.label = param.label;
		this.startTime=param.startTime;
		this.endTime = param.endTime;
		this.desc = param.desc;
		this.markColor = param.markColor || 6076508;
		this.priority = param.priority || 0;
		this.privacy = param.privacy || 0;
		this.attachments = (function(attachments){
			if(!attachments)
				return [];
			
			return attachments.map(function(attachment){
				var att = new Attachment();
				att.init({
					id: attachment.id,
					url: attachment.url
				});
				return att;
			})
		})(param.attachments);
		
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
		this.attachments.map(function(at){
			attachments.push(at.dump());
		})

		var subtasks = [];
		this.subtasks.map(function(sp){
			subtasks.push(sp.dump());
		})
		
		return {
			id: this.id,
			label: this.label,
			startTime: this.startTime,
			endTime: this.endTime,
			desc: this.desc,
			markColor: this.markColor,
			attachments: attachments,
			creatorId: this.creatorId,
			priority: this.priority,
			subtasks: subtasks,
			privacy: this.privacy,
			template: this.template,
			class: 'Task',
			statical: this.statical
		}
	}
}