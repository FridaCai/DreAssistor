import {ExcelUtil} from 'XlsIExport';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import ButtonGroup from 'ButtonGroup';
import Input from 'Input';
import Time from 'Time';

import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {COMPONENT_LABEL_ENUM} from '../../data/template/mix.js';
import {MultipleParam} from '../../data/template/mix.js';
import {SingleParam} from '../../data/template/mix.js';
import {ExpandLine} from "Table";
import {ExpandContainerDOM} from "Table";




//todo: bad
import MultipleParamUIData from "../../taskpopup/uidata/multipleparam.js";


class Property extends Base{
	constructor(){
		super();
		this.components = ["label", "text", "value", "time"];
		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: '属性'}), 
				Cell.create({component: Label, v: '文本'}),
				Cell.create({component: Label, v: '数值'}),
				Cell.create({component: Label, v: '时间'})
			]
		});
		this.sheetName = `项目属性`;
	}

	ui2dm(dm){
		dm.label = this.ui[0].getCellAt(1).getValue();
		dm.sorp = this.ui[1].getCellAt(3).getValue();



		var projectproperties = ["platform", "bodyStyle"];
		var multipleParam = [];
		for(var i=2; i<2+projectproperties.length; i++){
			var line = this.ui[i];
			var id = line.id;
			if(line instanceof ExpandLine)
				continue;


			var singleParam = {key: id};
			this.components.map(function(component, index){
				singleParam[component] = line.getCellAt(index).getValue();
			})
			multipleParam.push(singleParam);
		}

		dm.properties = MultipleParam.create(multipleParam);

		var addBtnLine = 1;
		var editBtnLine = 1;
		var engineproperties = ['name', 'transmission'];
		var projectProperyNum = 2 + engineproperties.length;
		var engineNum = (this.ui.length - projectProperyNum - addBtnLine) / (engineproperties.length + editBtnLine);
		

		debugger;
		var engineParams= [];
		for(var j=0; j<engineNum; j++){
			var base = projectProperyNum + 1 + j * (engineproperties.length + 1);

			var properties = [];
			for(var k=0; k<engineproperties.length; k++){
				var line = this.ui[base+k]; //take care of expand line.


				var property = {key: line.key};
				this.components.map(function(component, index){
					property[component] = line.getCellAt(index).getValue();
				})
				properties.push(property);
			}


			var engineParam = {
				properties: properties
			}
			engineParams.push(engineParam);

		}


		dm.engines.clear();
		dm.engines.init(engineParams);

        //sorp: ExcelUtil.convertYYYYMMDD2UnixTime(value);
	}


	getCellByComponent(component, project, property){

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
			        	expandComponent: AttachmentList,
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
			        	expandComponent: AttachmentList,
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
							this.v = v;
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
				var options = property.dropdown.options.map(function(label, index){
			    	return {
			    		id: index,
			    		label: label
			    	}
			    });
				return Cell.create({
	        		component: ComboBox,
	        		param: {
	        			selectedId: property.dropdown.selectedIndex, //string. existed id in options.
					    options: options,
					    prompt: "请选择", 
					    onchange: function(selectedKey){
					    	this.v = {
					    		selectedIndex: selectedKey,
					    		options: property.dropdown.options
					    	};
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



		var labelCells = this.components.map(function(component){
			if(component === COMPONENT_ENUM.LABEL){
				return Cell.create({
					component: Label,
					v: '项目名称',
				})
			}else if(component === COMPONENT_ENUM.TEXT){
				return Cell.create({
					component: Input, 
					param: {
						onChange: function(v){
							this.v = v;
						}, 
						onBlur: function(){
							MultipleParamUIData.signal_data_change.dispatch();
						},
			        	value: project.label,
					}, 
					v: project.label
				});
			}else{
				return Cell.create({
					component:Label,
					v:undefined,
				})
			}
		})

		this.ui.push(Line.create({
			cells: labelCells,
			id: 'label'
		}))

		var sorpCells = this.components.map(function(component){
			if(component === COMPONENT_ENUM.LABEL){
				return Cell.create({
					component: Label,
					v: 'SORP',
				})
			}else if(component === COMPONENT_ENUM.TIME){
				return Cell.create({
        			component: Time,
        			param: {
        				value: project.sorp,
        				onChange: function(time){
        					this.v = time;
        					MultipleParamUIData.signal_data_change.dispatch();
        				}
        				
        			},
        			v: project.sorp
        		})
			}else{
				return Cell.create({
					component:Label,
					v:undefined,
				})
			}
		})
		this.ui.push(Line.create({
			cells: sorpCells,
			id: 'sorp'
		}))


		Object.keys(project.properties).map((function(k){
			var property = project.properties[k];

			if(property instanceof SingleParam){
				var key = property.key;
				var cells = this.components.map((function(component){
					if(property[component] == undefined){
						return Cell.create({
							component:Label,
							v:undefined,
						})
					}
					return this.getCellByComponent(component, null, property);
				}).bind(this));	

				var expandLine = needExpandLine ? ExpandLine.create({
					cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
				}): null;

				this.ui.push(Line.create({
					cells: cells,
					expandLine: expandLine,
					id: key
				}))

				if(needExpandLine){
					this.ui.push(expandLine);
				}	
			}
			
		}).bind(this));



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
			var engineId = engine.id;
			var properties = engine.properties;

			Object.keys(properties).map((function(k){
				var property = properties[k];


				if(property instanceof SingleParam){
					var key = property.key;

					var cells = this.components.map((function(component){
						if(property[component] === undefined){
							return Cell.create({
								component:Label,
								v:undefined
							})
						}
						return this.getCellByComponent(component, null, property);
					}).bind(this));

					var expandLine = needExpandLine ? ExpandLine.create({
						cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
					}): null;

					this.ui.push(Line.create({
						cells: cells,
						expandLine: expandLine,
						id: key
					}))

					if(needExpandLine){
						this.ui.push(expandLine);
					}
				}
				
			}).bind(this));


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
			this.ui.push(Line.create({cells: cells}))

		}).bind(this))
	}
}

Property.signal_add_engine = new Signal();
Property.signal_copy_engine = new Signal();
Property.signal_delete_engine = new Signal();

module.exports = Property;