import {ExcelUtil} from 'XlsIExport';
import GlobalUtil from 'Util';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Label from 'Label';
import Curve from 'data/curve.js';
import ColorCheckbox from '../widget/colorcheckbox.js';
class CurveUI extends Base{ 
	constructor(){
		super();
		this.sheetName = `曲线`;
		this.toggleSignal = undefined;
	}

	setToggleSignal(signal){
		this.toggleSignal = signal;
	}

	onToggle(){
		this.toggleSignal && this.toggleSignal.dispatch();
	}

	dump(){
		var dumpui = [];
		var tmp = [];
		this.header.cells.map(function(cell){
			tmp.push(`${cell.v}, ${cell.param.isCheck}`);
		})
		dumpui.push(tmp);
	}
	xls2ui(param){
		var ui = ExcelUtil.excel2ui(param);

		var headerdm = ui[0].cells.map(function(cell, index){
			return {
				isShowCurve: true,
				label: cell.v,
				data: index
			}	
		})
		this.header = this._headerDm2UI(headerdm);

		this.ui = ui.splice(1);
	}
	ui2xls(){
		ExcelUtil.ui2excel({
			curve: this
		});
	}

	ui2dm(curve){
		var pretty = function(value){
      		return Math.round(parseFloat(value) * 100) / 100;
		}
   
        var series = this.header.cells.map(function(h, i){
        	if(i == 0){
        		return {
        			label: h.v,
        			isShowCurve: true,
        			data: i
        		}
        	}else{
        		return {
	        		label: h.param.label,
					isShowCurve: h.v,
					data: i
	        	}
        	}
        	
        })

        var data = [];
        var lineNum = this.header.cells.length;
		var columnNum = this.ui.length;

        for(var i=0; i<lineNum; i++){
        	var line = [];
        	for(var j=0; j<columnNum; j++){
        		var tmp = this.ui[j].cells[i].v;
        		tmp = pretty(tmp);
        		tmp = tmp ? tmp:0;

        		line.push(pretty(tmp));
        	}
        	data.push(line);
        }

		curve.update({
			caption: '',
			series: series,
			data: data,
		})
	}

	_headerDm2UI(dm){
		var me = this;
		var createLine = function(label, isShowCurve, index){
			return Cell.create({
				component: ColorCheckbox, 
				param: {
					color: GlobalUtil.COLORS[index % 24], 
					isCheck: isShowCurve, 
					label: label,  
					onCheckboxChange: function(isCheck){
						this.v = isCheck;
						me.onToggle();
					},
				}, 
				v: isShowCurve,
			});
		}
		var cells = dm.map(function(serie, index){
			var {label, isShowCurve} = serie;

			if(index === 0){
				return Cell.create({component: Label, v: label});
			}else{
				return createLine(label, isShowCurve, index-1);	
			}
			
		})
		return Line.create({cells: cells});
	}

	dm2ui(curve){
		this.header = this._headerDm2UI(curve.series);
		this.ui = (function(){
			var returnUI = [];
			var rowNum = curve.data[0].length; 
			var columnNum = curve.data.length; 

			for(var i=0; i<rowNum; i++){
				var cells = [];

				for(var j=0; j<columnNum; j++){
					var v = curve.data[j][i];				
					cells.push(Cell.create({component: Label, v: v}));
				}

				var line = Line.create({cells: cells});
				returnUI.push(line);
			}
			return returnUI;
		})();
	}

}


module.exports = CurveUI;