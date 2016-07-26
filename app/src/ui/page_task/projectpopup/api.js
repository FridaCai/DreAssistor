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
		var url = Request.getMockupAPI('template_project.json');
        return Request.getData(url).then((function(result){
 			return result;
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

	tryXls2ui: function(param){
		var propertySheet = param.property;
		var tagSheet = param.tag;
		var taskSheet = param.task;

		var errorCode = -1;
		var errorMsg = '';

		try{
			//overwrite data strategy for now. for multiple task sheet case, think about other strategy.
			
			propertySheet.map((function(sheet){
				var property = new Property();
				property.xls2ui(sheet.sheet);
				this.uidata.property = property;	
			}).bind(this))

			tagSheet.map((function(sheet){
				var tag = new Tag();			
				tag.xls2ui(sheet.sheet);
				this.uidata.tag = tag;	
			}).bind(this))
			
			taskSheet.map((function(sheet){
				var task = new Task();
				if(sheet.mode ==1)
					task = this.uidata.task;

				task.xls2ui(sheet.sheet);
				this.uidata.task = task;	
			}).bind(this))
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

