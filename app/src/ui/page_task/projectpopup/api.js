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

	getUIDataByProject: function(project){
		if(!project){
			return undefined;
		}

		var property = new Property();
		property.dm2ui(project);

		var tags = new Tags();
		tags.dm2ui(tags);

		var tasks = new Tasks();
		tasks.dm2ui(tasks);


		return {
			property: property,
			tags: tags,
			tasks: tasks,
		}
	},

	getUIDataByTemplate: function(){
        return Request.getData(Request.getMockupAPI('template_project.json')).then((function(result){
            var project = new Project();
            project.init(result);
            return this.getUIDataByProject(project);
        }).bind(this))
	},


	//when to call? drag/import excel; close create project;
	clear:function(){
		this.project = new Project();
	},
}

module.exports = API;

