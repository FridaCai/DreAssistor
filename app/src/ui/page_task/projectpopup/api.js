import Signal from '../../../signal.js';
import Request from '../../../request.js';
import Tags from './data/tags.js';
import Tasks from './data/tasks.js';
import Property from './data/property.js';
import Project from '../data/project.js';

var API = {
	signal_popup_show: new Signal(),

	project: new Project(),

	uidata: {
		property: new Property(), 
		tags: new Tags(),
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
		//todo: tag and tasks.



	},

	dm2ui: function(){
		if(!this.project){
			return;
		}

		var property = new Property();
		property.dm2ui(this.project);

		var tags = new Tags();
		tags.dm2ui(this.project);

		var tasks = new Tasks();
		tasks.dm2ui(this.project);

		this.uidata = {
			property: property,
			tags: tags,
			tasks: tasks,
		}
	},

	tryXls2ui: function(param){
		var {propertySheet, tagSheet, taskSheets} = param;

		var errorCode = -1;
		var errorMsg = '';

		try{
			debugger;
			//overwrite data strategy for now. for multiple task sheet case, think about other strategy.
			var property = new Property();
			if(propertySheet){
				property.xls2ui(propertySheet);	
			}

			var tags = new Tags();			
			if(tagSheet){
				tags.xls2ui(tagSheet);	
			}

			var tasks = new Tasks();
			if(taskSheets){
				tasks.xls2ui(taskSheets);	
			}

			this.uidata = {
				property: property,
				tags: tags, //tags or tag?
				tasks: tasks
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

