import {Base} from 'Table'; 
import {Cell} from 'Table';
import {ExpandLine} from 'Table';
import {Line} from 'Table';
import {ExpandContainerDOM} from 'Table';
import {ExpandCellDOM} from 'Table';

import CurveComponent from '../../../component_curve/index.js';
import AttachmentList from 'AttachmentList';

import Label from 'Label';
import RadioGroup from 'RadioGroup';
import Input from 'Input';
import ComboBox from 'ComboBox'; 

import Signal from 'Signal';

import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {COMPONENT_LABEL_ENUM} from '../../data/template/mix.js';


import {Attachments} from '../../data/attachments.js';
import {Images} from '../../data/images.js';

import {SingleParam} from '../../data/template/mix.js';
import DROPDOWN_OPTIONS from '../../../../config/dropdown.json';

class MultipleParamUIData extends Base{
	constructor(){
		super();
		this.header = null;
		this.sheetName = '';
		this.components = [];
	}
	setComponents(dm){
		var meetcondition = function(componentKey, componentValue, components){
			if(componentValue === undefined)
				return false;
			if(components.indexOf(componentKey)!=-1)
				return false;

			if(componentKey === 'key'){
				return false;
			}
			return true;
		}

		var self = this;
		Object.keys(dm).map(function(key){
			var property = dm[key];
			Object.keys(property).map(function(componentKey){
				var componentValue = property[componentKey];
				if(meetcondition(componentKey, componentValue, self.components)){
					self.components.push(componentKey);	
				}
			})
		})


		//todo: bad.

		/*this.components = [
			COMPONENT_ENUM.LABEL,
			COMPONENT_ENUM.STATUS,
			COMPONENT_ENUM.REFKEY,
			COMPONENT_ENUM.ATTACHMENTS,
			COMPONENT_ENUM.VALUE,
			COMPONENT_ENUM.CURVE,
		]*/
	}
	setHeader(){
		var cells = this.components.map((function(key){
			var label = COMPONENT_LABEL_ENUM[key];
			return Cell.create({component: Label, v: label});
		}).bind(this))
		cells.sort();

		this.header = Line.create({cells: cells});
	}
	ui2dm(dm){
		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];
			var id = line.id;
			if(line instanceof ExpandLine)
				continue;

			this.components.map(function(component, index){
				if(dm[id] instanceof SingleParam){
					dm[id][component] = line.getCellAt(index).getValue();	
				}
				
			})
		}
	}
	getCellByComponent(component, project, dm, key){
		var property = dm[key];

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
		}
	}

	dm2ui(project, dm){
		var needExpandLine = (function(components){
			if(components.indexOf(COMPONENT_ENUM.CURVE)!=-1 
				|| components.indexOf(COMPONENT_ENUM.ATTACHMENTS)!=-1 
				|| components.indexOf(COMPONENT_ENUM.IMAGES)!=-1){
				return true;
			}
			return false;
		})(this.components)

		Object.keys(dm).map((function(key){

			var property = dm[key];
			if(property instanceof SingleParam){
				var cells = this.components.map((function(component){
					if(property[component] === undefined){
						return Cell.create({
							component:Label,
							v:undefined
						})
					}
						
					return this.getCellByComponent(component, project, dm, key);
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
	}
}
MultipleParamUIData.signal_expand_toggle = new Signal();
MultipleParamUIData.signal_data_change = new Signal();
module.exports = MultipleParamUIData;





