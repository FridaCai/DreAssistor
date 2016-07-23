import Signal from '../../../signal.js';
import Request from '../../../request.js';
import Task from './data/task.js';
import Tag from './data/tag.js';
import Property from './data/property.js';
import Project from '../data/project.js';

var API = {
	signal_popup_show: new Signal(),

	project: new Project(),

	uidata: {
		property: new Property(), 
		tag: new Tag(),
		task: new Task(),
	},
	getProject: function(){
		return this.project;
	},
	setProject: function(value){
		this.project = value;
	},

	loadTemplate: function(){ 
        return Request.getData(Request.getMockupAPI('template_project.json')).then((function(result){
            this.project = new Project();
            this.project.init(result);
            this.dm2ui();
        }).bind(this))
	},


	ui2dm: function(){
		this.uidata.property.ui2dm(this.project);
		this.uidata.tag.ui2dm(this.project);
		this.uidata.task.ui2dm(this.project);
	},

	dm2ui: function(){
		if(!this.project){
			return;
		}

		var property = new Property();
		property.dm2ui(this.project);

		var tag = new Tag();
		tag.dm2ui(this.project);

		var task = new Task();
		task.dm2ui(this.project);

		this.uidata = {
			property: property,
			tag: tag,
			task: task,
		}
	},

	tryXls2ui: function(param, datamode){
		var {propertySheet, tagSheet, taskSheets} = param;
		var taskMode = datamode.task;

		var errorCode = -1;
		var errorMsg = '';

		try{
			//overwrite data strategy for now. for multiple task sheet case, think about other strategy.
			
			if(propertySheet){
				var property = new Property();
				property.xls2ui(propertySheet);
				this.uidata.property = property;	
			}

			
			if(tagSheet){
				var tag = new Tag();			
				tag.xls2ui(tagSheet);	
				this.uidata.tag = tag;
			}

			
			if(taskSheets && taskSheets.length!=0){
				var task = new Task();
				if(taskMode ==1)
					task = this.uidata.task;

				task.xls2ui(taskSheets, taskMode);
				this.uidata.task = task;	
			}

		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg
		}
	},

	//when to call? drag/import excel; close create project;
	clear:function(){
		this.project = new Project();
	},
}
window.dre.projectpopup = {
	data: API	
};
module.exports = API;

