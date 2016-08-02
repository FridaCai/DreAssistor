import Base from '../../projectpopup/data/base.js'; //todo.
import {Cell} from 'Table';
import CurveComponent from '../../../component_curve/index.js';

module.exports = class MuleMRD extends Base{
	constructor(){
		super();
		this.header = [
			Cell.create({v: '属性'}), 
            Cell.create({v: '目标'}),
            Cell.create({v: '状态'}),
            Cell.create({v: '实测'}),
            Cell.create({v: '附件'})
        ];
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


			var expandLine = Cell.create({components: [{type: Cell.ComponentEnum.ExpandCellTR}]});

	        var curveCellParam = {
	        	label: '曲线图',
	        	expandComponent: CurveComponent,
	        };

	        var attachmentCellParam = {
	        	label: '附件', 
	        	expandComponent: '',
	        };

			var line = [
				Cell.create({v: label}), 
				Cell.create({v: ref}), 
				Cell.create({components: [{type: Cell.ComponentEnum.RadioGroup, param: radioGroupParam}]}),
				isCurve ? Cell.create({components: [{type: Cell.ComponentEnum.ExpandCell, param: curveCellParam}]}): 
					Cell.create({v: value.value, components:[{type: Cell.ComponentEnum.Input, onChange: function(){}, onBlur:function(){}}]}),
				Cell.create({components: [{type: Cell.ComponentEnum.ExpandCell, param: attachmentCellParam}]})
			];
	       
	      	this.ui.push(line);
      		this.ui.push([expandLine]);
		}).bind(this));
	}

	getUI(){
		return this.ui;
	}
}




