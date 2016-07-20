import Signal from '../../../signal.js';
import Request from '../../../request.js';
import Tasks from './data/tasks.js';
import Tag from './data/tag.js';
import Property from './data/property.js';
import Project from '../data/project.js';

var API = {
	signal_popup_show: new Signal(),

	project: new Project(),

	uidata: {
		property: new Property(), 
		tag: new Tag(),
		tasks: new Tasks(),
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
		//todo: tag and tasks.



	},

	dm2ui: function(){
		if(!this.project){
			return;
		}

		var property = new Property();
		property.dm2ui(this.project);

		var tag = new Tag();
		tag.dm2ui(this.project);

		var tasks = new Tasks();
		tasks.dm2ui(this.project);

		this.uidata = {
			property: property,
			tag: tag,
			tasks: tasks,
		}
	},

	tryXls2ui: function(param){
		var {propertySheet, tagSheet, taskSheets} = param;

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

			
			if(taskSheets){
				var tasks = new Tasks();
				tasks.xls2ui(taskSheets);
				this.uidata.tasks = tasks;	
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

module.exports = API;

