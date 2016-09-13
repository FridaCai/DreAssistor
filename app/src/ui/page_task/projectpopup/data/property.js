import {ExcelUtil} from 'XlsIExport';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import ButtonGroup from 'ButtonGroup';
import Input from 'Input';
import Time from 'Time';
import AttachmentList from 'AttachmentList';

import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {COMPONENT_LABEL_ENUM} from '../../data/template/mix.js';
import {MultipleParam} from '../../data/template/mix.js';
import {SingleParam} from '../../data/template/mix.js';
import {ExpandLine} from "Table";
import {ExpandContainerDOM} from "Table";
import {ExpandCellDOM} from "Table";
import {LineGroup} from "Table";
import CurveComponent from '../../../component_curve/index.js';



//todo: bad
import MultipleParamUIData from "../../taskpopup/uidata/multipleparam.js";
import DROPDOWN_OPTIONS from '../../../../config/dropdown.json';

import Engine from '../../data/engine.js';

class Property extends Base{
	constructor(){
		super();
		this.components = ["label", "text", "value", "time", "curve"];
		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: '属性'}), 
				Cell.create({component: Label, v: '文本'}),
				Cell.create({component: Label, v: '数值'}),
				Cell.create({component: Label, v: '时间'}),
				Cell.create({component: Label, v: '曲线'})
			]
		});
		this.sheetName = `项目属性`;
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
						dm.sorp = line.getCellAt(3).getValue();					
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


	getCellByComponent(component, project, property){
		if(property[component] === undefined){
			return Cell.create({
				component:Label,
				v:undefined
			})
		}

		var key = property.key;
		switch(component){
			case COMPONENT_ENUM.LABEL:
				return Cell.create({
					component: Label, 
					v: property.label
				});
			case COMPONENT_ENUM.STATUS:
				return Cell.create({
					component: RadioGroup, 
					param:{
			            id: `radiogroup_${key}`,
			            selectedId: property.status ? 0: 1,
			            options: [{
			                id: 0,
			                label:"完成"
			            },{
			                id: 1,
			                label: "未完成"
			            }],
			            onChange: function(selectedId){
			            	this.v = (selectedId === 0 ? true : false);

			            	MultipleParamUIData.signal_data_change.dispatch();
			            },
			        }, 
			        v: property.status
			    });
			case COMPONENT_ENUM.REFKEY:
				return Cell.create({
					component: Label, 
					v: (function(refKey, project){
				       		return refKey && project ? project[refKey]: '';
				       }).call(this, property.refKey, project)
				});

			case COMPONENT_ENUM.IMAGES:
				var itms = property[component] || new Images(); 
				var label = COMPONENT_LABEL_ENUM[component];

				return Cell.create({
	        		component: ExpandCellDOM, 
	        		param: {
			        	label: label,
			        	isOpen: false,
			        	onExpandToggle: function(){
			        		MultipleParamUIData.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: AttachmentList, /*strange. no import for AttachmentList. work?*/
			        	expandComponentParam: {
			        		id: key,
			        		attachments: itms,
			        		onDelete: function(itms){
			        			this.v = itms;			        			
			        		},
			        		onAdd: function(itms){
			        			this.v = itms;
			        		}
			        	}
			        }, 
			        v:itms
			    })
			case COMPONENT_ENUM.ATTACHMENTS:
				var itms = property[component] || new Attachments(); 
				var label = COMPONENT_LABEL_ENUM[component];

				return Cell.create({
	        		component: ExpandCellDOM, 
	        		param: {
			        	label: label,
			        	isOpen: false,
			        	onExpandToggle: function(){
			        		MultipleParamUIData.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: AttachmentList,/*strange. no import for AttachmentList. work?*/
			        	expandComponentParam: {
			        		id: key,
			        		attachments: itms,
			        		onDelete: function(itms){
			        			this.v = itms;
			        			
			        		},
			        		onAdd: function(itms){
			        			this.v = itms;
			        		}
			        	}
			        }, 
			        v:itms
			    })

			case COMPONENT_ENUM.VALUE:
	        	return Cell.create({
					component: Input, 
					param: {
						onChange: function(v){
							this.v = parseFloat(v) || 0;
						}, 
						onBlur: function(){
							MultipleParamUIData.signal_data_change.dispatch();
						},
			        	value: property.value,
					}, 
					v: property.value
				});
			case COMPONENT_ENUM.CURVE:
				return Cell.create({
					component: ExpandCellDOM, 
					param: {
			        	label: '曲线图',
			        	isOpen: false, //need? redundant???
			        	onExpandToggle: function(){
			        		MultipleParamUIData.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: CurveComponent,
			        	expandComponentParam: {
			        		id: key,
			        		curve: property.curve,
			        		onImportCurve: function(curve){
			        			this.v = curve;
			        			MultipleParamUIData.signal_data_change.dispatch();
			        		}
			        	}
		        	}, 
		        	v:property.curve
		        });
			
			case COMPONENT_ENUM.TEXT:
				return Cell.create({
					component: Input, 
					param: {
						onChange: function(v){
							this.v = v;
						}, 
						onBlur: function(){
							MultipleParamUIData.signal_data_change.dispatch();
						},
			        	value: property.text,
					}, 
					v: property.text
				});
			case COMPONENT_ENUM.DROPDOWN:
				var key = property.key;
				var optionStrings = DROPDOWN_OPTIONS[key];

				var options = optionStrings.map(function(label, index){
			    	return {
			    		id: index,
			    		label: label
			    	}
			    });
			    var selectedIndex = optionStrings.indexOf(property.dropdown);

				return Cell.create({
	        		component: ComboBox,
	        		param: {
	        			selectedId: selectedIndex, //string. existed id in options.
					    options: options,
					    prompt: "请选择", 
					    onchange: function(selectedKey){
					    	this.v = optionStrings[selectedKey];
					    	MultipleParamUIData.signal_data_change.dispatch();
					    }
	        		},
	        		v: property.dropdown
	        	})
        	case COMPONENT_ENUM.TIME: //NEED TO UPDATE CODES IN DIFFERENT PLACE. BAD...
        		return Cell.create({
        			component: Time,
        			param: {
        				value: property.time,
        				onChange: function(time){
        					this.v = time;
        					MultipleParamUIData.signal_data_change.dispatch();
        				}
        				
        			},
        			v: property.time
        		})
		}
	}

	dm2ui(project){
		//todo: refactor. copy from multipleparam.js
		var cells = [];
		var needExpandLine = (function(components){
			if(components.indexOf(COMPONENT_ENUM.CURVE)!=-1 
				|| components.indexOf(COMPONENT_ENUM.ATTACHMENTS)!=-1 
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
						return this.getCellByComponent(component, null, property);
					}).bind(this));	

					var expandLine = needExpandLine ? ExpandLine.create({
						cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
					}): null;


					lineGroup.push(Line.create({
						cells: cells,
						expandLine: expandLine,
						id: property.id
					}))

					if(needExpandLine){
						lineGroup.push(expandLine);
					}	
				}
			}).bind(this));


			this.ui.push(LineGroup.create({
				lines: lineGroup,
			}))

		}).call(this);


		var generateEngineUI = (function(){
			var addEngineBtn = Cell.create({
				component: ButtonGroup,
				param: [{
					value: '添加发动机',
					onClick: function(){
						Property.signal_add_engine.dispatch();
					}
				}]
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
							return this.getCellByComponent(component, null, property);
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
						id: engine.id
					})
				);


				var cells = [Cell.create({
					component: ButtonGroup,
					param: [{
						value: "复制",
						onClick: function(){
							Property.signal_copy_engine.dispatch({engine: engine});
						}
					},{
						value: "删除",
						onClick: function(){
							Property.signal_delete_engine.dispatch({engine: engine});
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

module.exports = Property;