import SubTask from './subtask.js';
import Attachment from './attachment.js';

module.exports = class Task {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.startTime=param.startTime;
		this.endTime = param.endTime;
		this.desc = param.desc;
		this.markColor = param.markColor;
		
		this.attachments = param.attachments;
		param.attachments.map((function(attachment){
			var att = new Attachment();
			att.init({
				id: attachment.id,
				url: attachment.url
			});
		}).bind(this))


		this.creatorId = param.creatorId;
		this.priority = param.priority;
		
		this.subtasks = [];
		param.subtasks.map((function(subtask){
			var st = new SubTask();
			st.init(subtask);
			st.setParent(this);
			this.subtasks.push(st);
		}).bind(this));

		this.privacy = param.privacy;
		this.template = param.template;
		this.parent = undefined;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
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
}