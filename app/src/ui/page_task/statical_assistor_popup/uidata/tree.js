import Util from 'Util';

module.exports = class TreeData{
	static _convertProperty2TreeData(property){
		var children = [];
		if(property.value != undefined){
			children.push({
				name: `数值: ${property.value}`,
				draggable: true,
				instance: property,
				component: 'value'
			});
		}
		if(property.text){
			children.push({
				name: `文本: ${property.text}`,
				draggable: true,
				instance: property,
				component: 'text'
			});
		}
		if(property.curve != undefined){
			children.push({
				name: `曲线: ${Util.isUUID(property.curve.id) ? '无':'略'}`,
				draggable: true,
				instance: property,
				component: 'curve'
			})
		}
		if(property.dropdown){
			children.push({
				name: `选项: ${property.dropdown}`,
				draggable: true,
				instance: property,
				component: 'dropdown'
			})	
		}
		if(property.status!=undefined){
			var status = (property.status?'完成':'未完成');
			children.push({
				name: `状态: ${status}`,
				draggable: true,
				instance: property,
				component: 'dropdown'
			})	
		}
		return children;
	}

	//dm 2 ui (tree data).
	static convertProjects2TreeData(projects){
		var projectsUIData = projects.forEachProject(function(project){
			var tasksUIData = {
				name: '豆豆', 
				children: project.forEachTask(function(task){
					var name = `${task.label} (${Util.convertUnixTimeToDate(task.startTime)} ~ ${Util.convertUnixTimeToDate(task.endTime)})`;
					return {
						draggable: true,
						instance: task, 
						name: name
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
				children: [tasksUIData, enginesUIData],
				draggable: true
			}
		})
		return {
			name: '项目',
			toggled: true,
			children: projectsUIData,
			draggable: true,
			instance: projects
		};
	}

	static convertProject2TreeData(project){
		var propertiesUIData = project.properties.map((function(property){
			return {
				name: property.label,
				children: TreeData._convertProperty2TreeData(property),
				toggled: true,
			}
		}).bind(this));

		var children = [{
			name: `创建者：${project.creatorId}`
		}].concat(propertiesUIData);

		return {
			name: project.label,
			toggled: true,
			instance: project,
			children: children
		}
	}

	static convertTask2TreeData(task){
		var label = task.label;

		var loop = task.template.sheetNames.length;
		var children = [];

		if(loop == 1){
			children = task.template.sheets[0].map((function(property){
				return{
					name: property.label,
					toggled: true,
					children: TreeData._convertProperty2TreeData(property)
				}
			}).bind(this))
			
		}else{
			for(var i=0; i<loop; i++){
				var sheetName = task.template.sheetNames[i];
				var sheet = task.template.sheets[i];

				children.push({
					name: sheetName,
					toggled: true,
					children: sheet.map((function(property){
						return {
							name: property.label,
							toggled: true,
							children: TreeData._convertProperty2TreeData(property)
						}
					}).bind(this))
				})
			}
		}
		
		return {
			name: `${label}`,
			toggled: true,
			children: children
		}
	}
	
	static convertEngine2TreeData(engine){
		var engineLabel = engine.properties.findSingleParamByKey('PROJECT.ENGINE.LABEL').text;
		return {
			name: engineLabel,
			toggled: true,
			children: engine.properties.map((function(property){
				return {
					name: property.label,
					toggled: true,
					children: TreeData._convertProperty2TreeData(property)
				}
			}).bind(this))
			
		}
	}
}