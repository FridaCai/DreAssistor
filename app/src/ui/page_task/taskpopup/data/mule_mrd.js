import {Base} from 'Table'; 
import {Cell} from 'Table';
import {ExpandLine} from 'Table';
import {Line} from 'Table';

import {ExpandContainerDOM} from 'Table';
import {ExpandCellDOM} from 'Table';

import CurveComponent from '../../../component_curve/index.js';
import AttachmentList from '../attachment_list.js';

import Label from 'Label';
import RadioGroup from 'RadioGroup';
import Input from 'Input';

import Signal from 'Signal';

class MuleMRDUI extends Base{
	constructor(){
		super();

		var line = Line.create({cells: [
			Cell.create({component:Label, v: '属性'}), 
			Cell.create({component:Label, v: '目标'}), 
			Cell.create({component:Label, v: '状态'}), 
			Cell.create({component:Label, v: '实测'}), 
			Cell.create({component:Label, v: '附件'}), 
		]});
		this.header = line;
		this.sheetName = '';
	}
	ui2dm(muleMRD){
		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];

			//todo: cell.getValue. 
			var label = line.getCellAt(0).getValue();
			var status = line.getCellAt(1).getValue();
			var value = line.getCellAt(4).getValue();

			var attachments = line.getCellAt(3).getValue();

			var curve = line.getCellAt(5).getValue();

			//todo: muleMRD dm set param.
		}
	}
	dm2ui(project, muleMRD){
	    Object.keys(muleMRD).map((function(key){
	        var value = muleMRD[key];
	        
	        var label = value.label;

	        var ref = (function(refKey, project){
	            return refKey && project ? project[refKey]: '';
	        }).call(this, value.refKey, project);
	        


			var isCurve = (function(v){
				var {value, curve} = v;

				if(value == null && curve != null){
					return true;
				}

				return false
			})(value);


	        var expandLine = ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			});

	       
	        var curveCellParam = {
	        	label: '曲线图',
	        	isOpen: false,
	        	onExpandToggle: function(){
	        		MuleMRDUI.signal_expand_toggle.dispatch();
	        	},



	        	expandComponent: CurveComponent,
	        	expandComponentParam: {
	        		id: key
	        	}
	        };

	        var attachmentCellParam = {
	        	label: '附件', 
	        	expandComponent: AttachmentList,
	        	isOpen: false,
	        	onExpandToggle: function(){
	        		MuleMRDUI.signal_expand_toggle.dispatch();
	        	}
	        };
	        








	        var c0 = Cell.create({component: RadioGroup, param:{
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
	            scope: undefined
	        }, v:false});
			c0.param.scope = c0;







			var c2 = Cell.create({component: Input, param: {
				onChange: function(v){
					this.v = v;
				}, 
	        	value: '',
	        	scope: undefined,
			}, v:''});
			c2.param.scope = c2;



















			var line = Line.create({
				cells: [
					Cell.create({component: Label, v: label}),
					Cell.create({component: Label, v: ref}),
					c0,
					isCurve ? Cell.create({component: ExpandCellDOM, param: curveCellParam, v:''}): 
						c2,
					Cell.create({component: ExpandCellDOM, param: attachmentCellParam, v:''})
				],
				expandLine: expandLine,
			});
			

	      	this.ui.push(line);
	      	this.ui.push(expandLine);
	      	
		}).bind(this));
	}

}
MuleMRDUI.signal_expand_toggle = new Signal();
MuleMRDUI.signal_doneStatus_change = new Signal();
MuleMRDUI.signal_value_change = new Signal();


//todo:
MuleMRDUI.signal_curve_change = new Signal();
MuleMRDUI.signal_attachment_change = new Signal();

module.exports = MuleMRDUI;

