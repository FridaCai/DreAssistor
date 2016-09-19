import Projects from '../data/projects';

var API = {
	_projects: undefined,
	_selectedEntity: undefined,

	setProjects: function(obj){
		this._projects = Projects.create(obj);
	},

	getProjects: function(){
		return this._projects;
	},

	setSelectEntity: function(entity){
		this._selectedEntity = entity;
	},

	getSelectEntity: function(){
		return this._selectedEntity;
	},

	//dm 2 ui (tree data).
	convertProjects2TreeData: function(projects){
		var projectsUIData = projects.forEachProject(function(project){

			var tasksUIData = project.forEachTask(function(task){ 
				return {
					instance: task, 
					name: task.label
				}
			})
			var enginesUIData = project.forEachEngine(function(engine){
				return {
					instance: engine,
					name: engine.getLabel()//bad...
				}
			})

			return {
				instance: project,
				name: project.label,
				children: tasksUIData.concat(enginesUIData)
			}
		})
		return {
			name: '项目',
			toggled: true,
			children: projectsUIData
		};

	},
}
module.exports = API;