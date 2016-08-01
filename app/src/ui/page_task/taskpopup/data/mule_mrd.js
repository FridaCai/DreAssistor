import Base from '../../projectpopup/data/base.js'; //todo.
import {Cell} from 'Table';


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

	        var curveCellParam = {};
	        var attachmentCellParam = {};
			//todo: radio hard code value.
			//todo: work on radio group and expand Cell.
			//todo: input should read component.v not cell.v;
			var isCurve = function(){
				if(value.value == null && value.curve != null){
					return true;
				}
				return false
			}
			var line = [
				Cell.create({v: label}), 
				Cell.create({v: ref}), 
				Cell.create({components: [{type: Cell.RadioGroup, param: radioGroupParam}]}),
				isCurve ? Cell.create({components: [{type: Cell.ExpandCell, param: curveCellParam}]}): Cell.create({v: value.value, components:[{type: Cell.Input}]}),
				Cell.create({components: [{type: Cell.ExpandCell, param: attachmentCellParam}]})
			];
	       
	      	this.ui.push(line);

		}).bind(this));
	}

	getUI(){
		return this.ui;
	}
}


/*
return (<ExpandCell label={'曲线图'} onToggleExpandPanel={this.onToggleCurve.bind(this, key)}/>)
*/






