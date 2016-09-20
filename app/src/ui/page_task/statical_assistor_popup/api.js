import Projects from '../data/projects';
import Signal from 'Signal';
import GloabalAPI from '../api.js';


import {Base} from 'Table';
import {Line} from 'Table';
import {Cell} from 'Table';
import Label from 'Label';
import ButtonGroup from 'ButtonGroup';

exports.TableData = class TableData extends Base{
	constructor(){
		super();

		this.header = Line.create({cells: [
			Cell.create({component: Label, v: ''}), 
			Cell.create({component: Label, v: 'X'}), 
			Cell.create({component: Label, v: 'Y1'}), 
			Cell.create({component: Label, v: 'Y2'}), 
		]});
		this.sheetName = `曲线`;


		this.ui.push(
			Line.create({cells: [
				Cell.create({component:ButtonGroup, param: [{
						value: 'Btn',
						onClick: function(){
							console.log('here');
						}
				}]}),
				Cell.create({component:Label, v: '0'}),
				Cell.create({component:Label, v: '1'}),
				Cell.create({component:Label, v: '2'})
			]})
		)
	}
	dump(){

	}
	ui2dm(dm){

	}
	dm2ui(dm){

	}
}


exports.API = {
	signal_treeNode_click: new Signal(),

	_projects: undefined,
	_selectedEntity: undefined,

	setProjects: function(obj){
		this._projects = Projects.create(obj);
	},

	getProjects: function(){
		return this._projects;
	},


	//dm 2 ui (tree data).
	convertProjects2TreeData: function(projects){
		var projectsUIData = projects.forEachProject(function(project){

			var tasksUIData = {
				name: '豆豆', 
				children: project.forEachTask(function(task){
					return {
						instance: task, 
						name: task.label
					}
				})
			}

			var enginesUIData = {
				name: '发动机',
				children: project.forEachEngine(function(engine){
					return {
						instance: engine,
						name: engine.getLabel()//bad...
					}
				})
			};
			

			return {
				instance: project,
				name: project.label,
				children: [tasksUIData, enginesUIData]
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
		var engineLabel = engine.properties.findSingleParamByKey('PROJECT.ENGINE.LABEL').text;
		return {
			name: engineLabel,
			toggled: true,
			children: engine.properties.map(function(property){
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
					toggled: true,
					children: children
				}
			})
			
		}
	}
}
