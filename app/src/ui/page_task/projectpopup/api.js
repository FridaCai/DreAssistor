import Signal from 'Signal';
import Task from './uidata/task.js';
import Tag from './uidata/tag.js';
import Property from './uidata/property.js';

import Project from 'data/project.js';
import SaveAs from 'browser-saveas';
import {ExcelUtil} from 'XlsIExport';


var API = {
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

	ui2dm: function(){
		this.uidata.property.ui2dm(this.project);
		this.uidata.tag.ui2dm(this.project);
		this.uidata.task.ui2dm(this.project);
	},

	addEngine: function(){
        this.project.addEngine();
	},
	dm2ui: function(){
		if(!this.project){
			return;
		}

		var property = new Property(); //todo: bad.
		property.setComponents(this.project);
		property.setHeader();
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

	xls2ui: function(param){
		var propertySheet = param.property;
		var tagSheet = param.tag;
		var taskSheet = param.task;

		var errorCode = -1;
		var errorMsg = '';

		try{
			//overwrite data strategy for now. for multiple task sheet case, think about other strategy.
			
			propertySheet.map(function(sheet){
				var property = new Property();
				property.xls2ui(sheet.sheet);
				API.uidata.property = property;	
			})

			tagSheet.map(function(sheet){
				var tag = new Tag();			
				tag.xls2ui(sheet.sheet);
				API.uidata.tag = tag;	
			})
			
			taskSheet.map(function(sheet){
				var task = new Task();
				if(sheet.mode ==1)
					task = API.uidata.task;

				task.xls2ui(sheet.sheet);
				API.uidata.task = task;	
			})
		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg
		}
	},
	ui2xls: function(){
		ExcelUtil.ui2excel(API.uidata);
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

