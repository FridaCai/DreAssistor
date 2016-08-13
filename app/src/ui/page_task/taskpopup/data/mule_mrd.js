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

class MuleMRDUI extends Base{
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
	ui2dm(muleMRD){
		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];
			if(line instanceof ExpandLine)
				continue;

			var status = line.getCellAt(2).getValue();
			var value = line.getCellAt(3).getValue();
			var curve = line.getCellAt(4).getValue();
			var attachments = line.getCellAt(5).getValue();

			var id = line.id;
			muleMRD[id].status = status;
			muleMRD[id].value = value; //todo: think twice. value might be null;
			muleMRD[id].curve = curve; 
			muleMRD[id].attachments = attachments; 
		}
	}
	dm2ui(project, muleMRD){
	    Object.keys(muleMRD).map((function(key){
	        var value = muleMRD[key];
	        
	        var label = value.label;

	        var ref = (function(refKey, project){
	            return refKey && project ? project[refKey]: '';
	        }).call(this, value.refKey, project);
	        


	        var expandLine = ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			});

	       



			var curveCellParam = {
	        	label: '曲线图',
	        	isOpen: false, //need? redundant???
	        	onExpandToggle: function(){
	        		MuleMRDUI.signal_expand_toggle.dispatch();
	        	},
	        	expandComponent: CurveComponent,
	        	expandComponentParam: {
	        		id: key,
	        		curve: value.curve,
	        		onImportCurve: function(curve){
	        			this.v = curve;
	        		}
	        	}
	        };
	        var c3 = Cell.create({component: ExpandCellDOM, param: curveCellParam, v:value.curve});
	        

	        var attachmentCellParam = {
	        	label: '附件', 
	        	isOpen: false,
	        	onExpandToggle: function(){
	        		MuleMRDUI.signal_expand_toggle.dispatch();
	        	},
	        	expandComponent: AttachmentList,
	        	expandComponentParam: {
	        		id: key,
	        		attachments: value.attachments,
	        		onAttachmentDelete: function(){
	        			debugger;
	        		},
	        		onAttachmentAdd: function(){
	        			debugger;
	        		}
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
					c2,
					c3,
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

