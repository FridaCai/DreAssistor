import Base from '../../projectpopup/data/base.js'; //todo.
import {Cell} from 'Table';
import {LineGroup} from 'Table';
import {ExpandLine} from 'Table';
import {Line} from 'Table';

import {ExpandContainerDOM} from 'Table';
import {ExpandCellDOM} from 'Table';

import CurveComponent from '../../../component_curve/index.js';
import AttachmentList from '../attachment_list.js';

import Label from 'Label';
import RadioGroup from 'RadioGroup';
import Input from 'Input';

module.exports = class MuleMRD extends Base{
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

	dm2ui(project, param){
	    Object.keys(param).map((function(key){
	        var value = param[key];
	        
	        var label = value.label;

	        var ref = (function(refKey, project){
	            return refKey && project ? project[refKey]: '';
	        }).call(this, value.refKey, project);
	        

	        var inputParam = {
	        	onChange: function(){}, 
	        	onBlur:function(){},
	        	value: '',
	        };

	        var radioGroupParam = {
	            id: `${key}_radiogroup`,
	            selectedId: value.status ? 0: 1,
	            options: [{
	                id: 0,
	                label:"完成"
	            },{
	                id: 1,
	                label: "未完成"
	            }],
	            onChange: (function(selectedId){
	                value.status = (selectedId === 0 ? true: false); 
	            }).bind(this),
	        }

			var isCurve = (function(v){
				var {value, curve} = v;

				if(value == null && curve != null){
					return true;
				}

				return false
			})(value);

			


	        var curveCellParam = {
	        	label: '曲线图',
	        	expandComponent: CurveComponent,
	        	isOpen: false,
	        };

	        var attachmentCellParam = {
	        	label: '附件', 
	        	expandComponent: AttachmentList,
	        	isOpen: false,
	        };
	        

	        var expandLine = ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			});

			var line = Line.create({
				cells: [
					Cell.create({component: Label, v: label}),
					Cell.create({component: Label, v: ref}),
					Cell.create({component: RadioGroup, param: radioGroupParam, v:0}),
					isCurve ? Cell.create({component: ExpandCellDOM, param: curveCellParam, v:''}): 
						Cell.create({component: Input, param: inputParam, v:''}),
					Cell.create({component: ExpandCellDOM, param: attachmentCellParam, v:''})
				],
				expandLine: expandLine,
			});
			

	      	this.ui.push(line);
	      	this.ui.push(expandLine);
	      	
		}).bind(this));
	}

	getUI(){
		return this.ui;
	}
}




