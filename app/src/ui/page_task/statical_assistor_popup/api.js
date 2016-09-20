import Projects from '../data/projects';
import Signal from 'Signal';
import GloabalAPI from '../api.js';

var API = {
	signal_treeNode_click: new Signal(),

	_projects: undefined,
	_selectedEntity: undefined,

	setProjects: function(obj){
		this._projects = Projects.create(obj);
	},

	getProjects: function(){
		return this._projects;
	},

	setSelectEntity_deprecated: function(type, obj){
		var entity;
		switch(type){
			case 'project':
				entity = this._projects.findProjectById(obj.id); //todo.
				break;
			case 'task':
				entity = this._projects.findTaskById(obj.id); //todo.
				break;
			case 'engine':
				entity = this._projects.findEngineById(obj.id); //todo.
				break;
		}
		entity.update(obj);

		this._selectedEntity = entity;
	},

	getSelectEntity_deprecated: function(){
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
	convertProject2TreeData: function(project){
		var propertiesUIData = project.properties.map(function(property){
			var children = [];

			if(property.value != undefined){
				children.push({
					name: `数值: ${property.value}`
				});
			}
			if(property.text){
				children.push({
					name: `文本: ${property.text}`
				});
			}
			if(property.curve != undefined){
				children.push({
					name: `曲线: 略`
				})
			}
			if(property.dropdown){
				children.push({
					name: `选项: ${property.dropdown}`
				})	
			}
			return {
				name: property.label,
				children: children,
				toggled: true,
			}
		})

		var children = [{
			name: `创建者：${project.creatorId}`
		}].concat(propertiesUIData);

		return {
			name: project.label,
			toggled: true,
			instance: project,
			children: children
		}
	},
	convertTask2TreeData: function(task){
		var templateName = GloabalAPI.findTemplateByType(task.template.type).label;
		var label = task.label;

		var loop = task.template.sheetNames.length;
		var children = [{
			 name: `${templateName}`
		}]

		for(var i=0; i<loop; i++){
			var sheetName = task.template.sheetNames[i];
			var sheet = task.template.sheets[i];

			children.push({
				name: sheetName,
				toggled: true,
				children: sheet.map(function(property){
					return {
						name: property.label,
						toggled: true,
						children: (function(){
							var children = [];
							if(property.value != undefined){
								children.push({
									name: `数值: ${property.value}`
								});
							}
							if(property.text){
								children.push({
									name: `文本: ${property.text}`
								});
							}
							if(property.curve != undefined){
								children.push({
									name: `曲线: 略`
								})
							}
							if(property.dropdown){
								children.push({
									name: `选项: ${property.dropdown}`
								})	
							}
							return children;
						})()
					}
				})
			})
		}

		return {
			name: `${label}`,
			toggled: true,
			children: children
		}
	},
	convertEngine2TreeData: function(engine){

	}
}
module.exports = API;