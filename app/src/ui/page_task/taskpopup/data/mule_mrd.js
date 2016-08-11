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

			if(line instanceof ExpandLine)
				continue;

			var id = line.id;

			//todo: cell.getValue. 
			var status = line.getCellAt(2).getValue();
			var value = (muleMRD[id].value === null ? null: line.getCellAt(3).getValue());

			var attachments = line.getCellAt(4).getValue();
			var curve = (muleMRD[id].curve === null ? null : line.getCellAt(3).getValue());

			//todo: muleMRD dm set param.

			muleMRD[line.id].status = status;
			muleMRD[line.id].value = value; //todo: think twice. value might be null;
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




	        var v = value.status;
	        var c0 = Cell.create({component: RadioGroup, param:{
	            id: `${key}_radiogroup`,
	            selectedId: v ? 0: 1,
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
	        }, v: v});







			var v = value.value;
			var c2 = Cell.create({component: Input, param: {
				onChange: function(v){
					this.v = v;
				}, 
	        	value: v,
			}, v: v});




			var line = Line.create({
				id: key,
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


//todo:
MuleMRDUI.signal_curve_change = new Signal();
MuleMRDUI.signal_attachment_change = new Signal();

module.exports = MuleMRDUI;

