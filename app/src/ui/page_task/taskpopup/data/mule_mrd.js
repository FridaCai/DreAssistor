import Base from '../../projectpopup/data/base.js'; //todo.
import {Cell} from 'Table';
import {LineGroup} from 'Table';
import {Line} from 'Table';
import {ExpandLine} from 'Table';
import CurveComponent from '../../../component_curve/index.js';
import AttachmentList from '../attachment_list.js';

module.exports = class MuleMRD extends Base{
	constructor(){
		super();

		var line = Line.create({cells: [
			Cell.create({v: '属性'}), 
            Cell.create({v: '目标'}),
            Cell.create({v: '状态'}),
            Cell.create({v: '实测'}),
            Cell.create({v: '附件'})
		]});
		this.header = line;

		this.sheetName = '';
	}

	dm2ui(project, param){
	    Object.keys(param).map((function(key){
	        var value = param[key];
	        var label = value.label;
	        
	        var ref = (function(refKey, project, label){
	            return refKey && project ? project[refKey]: '';
	        }).call(this, value.refKey, project, label)

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


			var expandLine = ExpandLine.create({
				cells: [Cell.create({components: [{type: Cell.ComponentEnum.ExpandCellTR}]})]
			});

	        var curveCellParam = {
	        	label: '曲线图',
	        	expandComponent: CurveComponent, //todo: need???
	        	onToggle: function(isOpen){
	        		cell.signal_expand_toggle.dispatch({isOpen:isOpen, expandComponent: CurveComponent});
	        	}
	        };

	        var attachmentCellParam = {
	        	label: '附件', 
	        	expandComponent: AttachmentList,
	        };

	        var inputParam = {
	        	onChange: function(){}, 
	        	onBlur:function(){}
	        }
			var line = Line.create({
				cells: [
					Cell.create({v: label}), 
					Cell.create({v: ref}), 
					Cell.create({components: [{type: Cell.ComponentEnum.RadioGroup, param: radioGroupParam}]}),
					isCurve ? Cell.create({components: [{type: Cell.ComponentEnum.ExpandCell, param: curveCellParam}]}): 
						Cell.create({v: value.value, components:[{type: Cell.ComponentEnum.Input, param: inputParam}]}),
					Cell.create({components: [{type: Cell.ComponentEnum.ExpandCell, param: attachmentCellParam}]})
				]
			});


	       	var group = LineGroup.create({lines: [line, expandLine]});
	      	this.ui.push(group);
		}).bind(this));
	}

	getUI(){
		return this.ui;
	}
}




