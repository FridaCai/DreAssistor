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
import Images from 'Images'; //todo.

import Signal from 'Signal';

import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {COMPONENT_LABEL_ENUM} from '../../data/template/mix.js';

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
			if(line instanceof ExpandLine)
				continue;

			var status = line.getCellAt(2).getValue();
			var value = line.getCellAt(3).getValue();
			var curve = line.getCellAt(4).getValue();
			var attachments = line.getCellAt(5).getValue();

			var id = line.id;
			dm[id].status = status;
			dm[id].value = value; //todo: think twice. value might be null;
			dm[id].curve = curve; 
			dm[id].attachments = attachments; 
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
			case COMPONENT_ENUM.ATTACHMENTS:
				return Cell.create({
	        		component: ExpandCellDOM, 
	        		param: {
			        	label: '附件', 
			        	isOpen: false,
			        	onExpandToggle: function(){
			        		MultipleParamUIData.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: AttachmentList,
			        	expandComponentParam: {
			        		id: key,
			        		attachments: property.attachments,
			        		onAttachmentDelete: function(attachments){
			        			this.v = attachments;
			        		},
			        		onAttachmentAdd: function(attachments){
			        			this.v = attachments;
			        		}
			        	}
			        }, 
			        v:property.attachments
			    })
			case COMPONENT_ENUM.VALUE:
	        	return Cell.create({
					component: Input, 
					param: {
						onChange: function(v){
							this.v = v;
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
			        		}
			        	}
		        	}, 
		        	v:property.curve
		        });
			case COMPONENT_ENUM.IMAGES:
				return Cell.create({
	        		component: ExpandCellDOM,
	        		param: {
	        			label: '图片',
	        			isOpen: false,
	        			onExpandToggle: function(){
			        		MultipleParamUIData.signal_expand_toggle.dispatch();
			        	},
			        	expandComponent: Images,
			        	expandComponentParam: {
			        		id: key,
			        		images: property.images,
			        	}
	        		}
	        	});
			case COMPONENT_ENUM.TEXT:
				return Cell.create({
					component: Input, 
					param: {
						onChange: function(v){
							this.v = v;
						}, 
			        	value: property.text,
					}, 
					v: property.text
				});
			case COMPONENT_ENUM.DROPDOWN:
				return Cell.create({
	        		component: ComboBox,
	        		param: {
	        			selectedId: property.dropdown.selectedIndex, //string. existed id in options.
					    options: property.dropdown.options.map(function(label, index){
					    	return {
					    		id: index,
					    		label: label
					    	}
					    }),
					    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
					    onchange: function(){

					    } //event triggered when selected item change.
	        		}
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


			var cells = this.components.map((function(component){
				if(property[component] === undefined){
					return Cell.create({
						component:Label,
						v:''
					})
				}
					
				return this.getCellByComponent(component, project, dm, key);
			}).bind(this));

			var expandLine = needExpandLine ? ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			}): null;

			this.ui.push(Line.create({
				cells: cells,
				expandLine: expandLine
			}))

			if(needExpandLine){
				this.ui.push(expandLine);
			}
		}).bind(this));
	}
}
MultipleParamUIData.signal_expand_toggle = new Signal();
module.exports = MultipleParamUIData;





