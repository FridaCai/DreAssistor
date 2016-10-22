import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import Button from 'Button';
import Group from 'Group';
import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {SingleParam} from '../../data/template/mix.js';
import {ExpandLine} from "Table";
import {ExpandContainerDOM} from "Table";
import {LineGroup} from "Table";
import DROPDOWN_OPTIONS from '../../../../config/dropdown.json';
import Engine from '../../data/engine.js';
import TmpUtil from 'TmpUtil';

class Property extends Base{
	constructor(){
		super();
		this.sheetName = `项目属性`;
		
	}
	setHeader(){
		this.header = TmpUtil.getHeader(this.components);
	}
	setComponents(dm){
		var singleParams = [SingleParam.create({
			label: "项目名称",
			text: dm.label
		}),
		SingleParam.create({
			label: "SORP",
			time: dm.sorp
		})];

		dm.properties.map(function(property){
			singleParams.push(property);
		});
		dm.engines.map(function(engine){
			engine.properties.map(function(property){
				singleParams.push(property);
			})
		});
		this.components = TmpUtil.getComponents(singleParams); //todo: refactor all tables and sheets;
	}

	ui2dm(dm){
		var components = this.components;
		var processProperty = function(l){
			l.lines.map(function(line, index){
				if(!(line instanceof ExpandLine)){
					if(index === 0){
						dm.label = line.getCellAt(1).getValue();
					}
					if(index === 2){
						dm.sorp = line.getCellAt(2).getValue();					
					}
					if(index > 2){
						var param = {};
						components.map(function(component, index){
							param[component] = line.getCellAt(index).getValue();
						})
						dm.properties.findById(line.id).update(param); //todo.
					}
				}
			})
		}

		var processEngine = function(lineGroup){
			var engineId = lineGroup.id;

			var properties = [];
			lineGroup.lines.map(function(line){
				if(!(line instanceof ExpandLine)){
					var param = {};
					components.map(function(component, index){
						param[component] = line.getCellAt(index).getValue();
					})
					param.id = line.id;
					param.key = line.meta.key;
					properties.push(param);
				}
			})

			var engineParam = {
				id: engineId,
				properties: properties
			}
			dm.engines.push(Engine.create(engineParam));
		}


		dm.engines.length = 0;
		this.ui.map(function(l, index){
			if(l instanceof LineGroup){
				if(index == 0){
					processProperty(l);
				}else{
					processEngine(l)
				}
			}
		})
	}



	dm2ui(project){
		//todo: refactor. copy from multipleparam.js
		var cells = [];
		var needExpandLine = (function(components){
			if(components.indexOf(COMPONENT_ENUM.CURVE)!=-1 
				|| components.indexOf(COMPONENT_ENUM.ATTACHMENT)!=-1 
				|| components.indexOf(COMPONENT_ENUM.IMAGES)!=-1){
				return true;
			}
			return false;
		})(this.components)


		var generatePropertyUI = (function(){
			var lineGroup = [];
			[
				SingleParam.create({
					label: "项目名称",
					text: project.label
				}),
				SingleParam.create({
					label: "SORP",
					time: project.sorp
				})
			]
			.concat(project.properties.map(function(sp){
				return sp;
			}))
			.map((function(property){
				if(property instanceof SingleParam){
					var key = property.key;
					var cells = this.components.map((function(component){
						return TmpUtil.getCellByComponent(component, property, Property);
					}).bind(this));	

					var expandLine = needExpandLine ? ExpandLine.create({
						cells: [Cell.create({component: ExpandContainerDOM, param: {}})],
					}): null;


					lineGroup.push(Line.create({
						cells: cells,
						expandLine: expandLine,
						id: property.id,
					}))

					if(needExpandLine){
						lineGroup.push(expandLine);
					}	
				}
			}).bind(this));


			this.ui.push(LineGroup.create({
				lines: lineGroup,
				parent: this
			}))

		}).call(this);


		var generateEngineUI = (function(){
			var addEngineBtn = Cell.create({
				component: Button,
				param: {
					label: '添加发动机',
					onClick: function(){
						Property.signal_add_engine.dispatch();
					}
				}
			});

			this.ui.push(Line.create({
				cells: [addEngineBtn]
			}))

			var engines = project.engines;
			engines.map((function(engine){
				var lineGroup = [];
				engine.properties.map((function(property){
					if(property instanceof SingleParam){
						var cells = this.components.map((function(component){
							return TmpUtil.getCellByComponent(component, property, Property);
						}).bind(this));


						var expandLine = needExpandLine ? ExpandLine.create({
							cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
						}): undefined;

						lineGroup.push(
							Line.create({
								cells: cells,
								expandLine: expandLine,
								id: property.id,
								meta: {
									key: property.key
								}
							})
						)

						if(needExpandLine){
							lineGroup.push(expandLine);
						}			
					}
				}).bind(this));
				


				this.ui.push(
					LineGroup.create({
						lines: lineGroup,
						id: engine.id,
						parent: this
					})
				);

				//todo: getCellByComponent ? 
				var cells = [Cell.create({
					component: Group,
					param: [{
						component: Button,
						param: {
							label: "复制",
							onClick: function(){
								Property.signal_copy_engine.dispatch({engine: engine});
							}
						}
					},{
						component: Button,
						param: {
							label: "删除",
							onClick: function(){
								Property.signal_delete_engine.dispatch({engine: engine});
							}
						}
					}]
				})];
				this.ui.push(
					Line.create({cells: cells})
				);
			}).bind(this));
		}).call(this);
	}
}

Property.signal_add_engine = new Signal();
Property.signal_copy_engine = new Signal();
Property.signal_delete_engine = new Signal();
Property.signal_expand_toggle = new Signal();
Property.signal_data_change = new Signal();


module.exports = Property;