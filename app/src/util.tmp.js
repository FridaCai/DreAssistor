//todo: short term solution. need to refactor sheets -> sheet -> table , property...
import Label from 'Label';
import Input from 'Input';
import Time from 'Time';
import AttachmentList from 'AttachmentList';
import RadioGroup from 'RadioGroup';
import {ExpandCellDOM} from "Table";
import {Cell} from "Table";
import {Line} from "Table";
import ComboBox from 'ComboBox'; 
import CurveComponent from 'CurveComponent';

import {COMPONENT_LABEL_ENUM, COMPONENT_ENUM} from './ui/page_task/data/template/mix.js'; //todo: 
import Images from './ui/page_task/data/images.js';
import Attachments from './ui/page_task/data/attachments.js';
import DROPDOWN_OPTIONS from './config/dropdown.json';

var TmpUtil = {
	getHeader(components){
		var cells = components.map((function(key){
			var label = COMPONENT_LABEL_ENUM[key];
			return Cell.create({component: Label, v: label});
		}).bind(this))
		//cells.sort();
		return Line.create({cells: cells});
	},

	getComponents(properties){
		var returnComponents = [];

		var meetcondition = function(componentKey, componentValue, components){
			if(componentValue === undefined)
				return false;
			if(components.indexOf(componentKey)!=-1)
				return false;

			if(componentKey === 'key' || componentKey === 'id'){
				return false;
			}
			return true;
		}

		properties.map(function(property){
			Object.keys(property).map(function(componentKey){
				var componentValue = property[componentKey];
				if(meetcondition(componentKey, componentValue, returnComponents)){
					returnComponents.push(componentKey);	
				}
			})
		})

		return returnComponents;
	},

	getCellByComponent(component, property, target){
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
			            	target.signal_data_change.dispatch(); 
			            },
			        }, 
			        v: property.status
			    });
			case COMPONENT_ENUM.REFKEY:
				return Cell.create({
					component: Label, 
					param: {
						value: property.value
					},
					v: property.v
				});
			case COMPONENT_ENUM.IMAGES:
				//var itms = property[component] || new Images();  //???
				var itms = property[component];
				var label = COMPONENT_LABEL_ENUM[component];

				return Cell.create({
	        		component: ExpandCellDOM, 
	        		param: {
			        	label: label,
			        	isOpen: false,
			        	onExpandToggle: function(){
			        		target.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: AttachmentList,
			        	expandComponentParam: {
			        		id: key,
			        		attachment: itms,
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
			case COMPONENT_ENUM.ATTACHMENT:
				//var itms = property[component] || new Attachments(); //?
				var itms = property[component];
				var label = COMPONENT_LABEL_ENUM[component];

				return Cell.create({
	        		component: ExpandCellDOM, 
	        		param: {
			        	label: label,
			        	isOpen: false,
			        	onExpandToggle: function(){
			        		target.signal_expand_toggle.dispatch(); //to do: override duplicate? call expand toggle again and again.
			        	},
			        	expandComponent: AttachmentList,
			        	expandComponentParam: {
			        		id: key,
			        		attachment: itms,
			        		propertyId: property.id,
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
							target.signal_data_change.dispatch();
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
			        		target.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: CurveComponent,
			        	expandComponentParam: {
			        		id: key,
			        		propertyId: property.id,
			        		curve: property.curve,
			        		templateKey: property.key,
			        		onImportCurve: function(curve){
			        			this.v = curve;
			        			target.signal_data_change.dispatch();
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
							target.signal_data_change.dispatch();
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
					    	target.signal_data_change.dispatch();
					    }
	        		},
	        		v: property.dropdown
	        	})
        	case COMPONENT_ENUM.TIME: 
        		return Cell.create({
        			component: Time,
        			param: {
        				value: property.time,
        				onChange: function(time){
        					this.v = time;
        					target.signal_data_change.dispatch();
        				}
        			},
        			v: property.time
        		})
		}
	}
}
module.exports = TmpUtil;