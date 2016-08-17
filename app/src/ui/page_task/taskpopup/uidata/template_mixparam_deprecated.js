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

import Signal from 'Signal';

class MixParamUIData extends Base{
	constructor(){
		super();

		var line = Line.create({cells: [
			Cell.create({component:Label, v: '属性'}), 
			Cell.create({component:Label, v: '目标'}), 
			Cell.create({component:Label, v: '状态'}), 
			Cell.create({component:Label, v: '实测数值'}), 
			Cell.create({component:Label, v: '实测曲线'}), 
			Cell.create({component:Label, v: '附件'}), 
		]});
		this.header = line;
		this.sheetName = '';
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
	dm2ui(project, dm){
	    Object.keys(dm).map((function(key){
	        var value = dm[key];

    		var expandLine = ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			})

			var line = Line.create({
				id: key,
				cells: [
					Cell.create({component: Label, v: value.label}),
					Cell.create({
						component: Label, 
						v: (function(refKey, project){
					       		return refKey && project ? project[refKey]: '';
					       }).call(this, value.refKey, project)
					}),
					Cell.create({
						component: RadioGroup, 
						param:{
				            id: `${key}_radiogroup`,
				            selectedId: value.status ? 0: 1,
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
				        v: value.status
				    }),
					Cell.create({
						component: Input, 
						param: {
							onChange: function(v){
								this.v = v;
							}, 
				        	value: value.value,
						}, 
						v: value.value
					}),
					Cell.create({
						component: ExpandCellDOM, 
						param: {
				        	label: '曲线图',
				        	isOpen: false, //need? redundant???
				        	onExpandToggle: function(){
				        		MixParamUIData.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: CurveComponent,
				        	expandComponentParam: {
				        		id: key,
				        		curve: value.curve,
				        		onImportCurve: function(curve){
				        			this.v = curve;
				        		}
				        	}
			        	}, 
			        	v:value.curve
			        }),
					Cell.create({
		        		component: ExpandCellDOM, 
		        		param: {
				        	label: '附件', 
				        	isOpen: false,
				        	onExpandToggle: function(){
				        		MixParamUIData.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: AttachmentList,
				        	expandComponentParam: {
				        		id: key,
				        		attachments: value.attachments,
				        		onAttachmentDelete: function(attachments){
				        			this.v = attachments;
				        		},
				        		onAttachmentAdd: function(attachments){
				        			this.v = attachments;
				        		}
				        	}
				        }, 
				        v:value.attachments
				    })
				],
				expandLine: expandLine,
			});

	      	this.ui.push(line);
	      	this.ui.push(expandLine);
		}).bind(this));
	}

}
MixParamUIData.signal_expand_toggle = new Signal();
module.exports = MixParamUIData;





