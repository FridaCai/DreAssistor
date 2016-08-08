import {ExcelUtil} from 'XlsIExport';
import GlobalUtil from 'Util';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Label from 'Label';
import Curve from '../data/curve.js';
import ColorCheckbox from '../widget/colorcheckbox.js';
import Signal from 'Signal';

class CurveUI extends Base{ 
	constructor(){
		super();

		var colorIndex = 0;


		var createLine = function(label){
			return Cell.create({
				component: ColorCheckbox, 
				param: {
					color: GlobalUtil.COLORS[colorIndex++ % 24], 
					isCheck: true, 
					label: label,  
					onCheckboxChange: function(isCheck){
						this.isCheck = isCheck;
						CurveUI.signal_curve_toggle.dispatch();
					}
				}, 
				v: label,
			})
		}


		var line = Line.create({cells: [
			Cell.create({component: Label, v: 'rpm'}), 
			createLine('QA-Level'),
			createLine('2 order'),
			createLine('4 order'),
			createLine('6 order')
		]});

		this.header = line;
		this.sheetName = `曲线`;
	}
	dump(){
		var dumpui = [];

		var tmp = [];
		this.header.cells.map(function(cell){
			tmp.push(`${cell.v}, ${cell.param.isCheck}`);
		})
		dumpui.push(tmp);


		
		this.ui.map(function(line){
			var tmp = [];
			line.cells.map(function(cell){
				tmp.push(`${cell.v}`);
			})
			dumpui.push(tmp);
		})

		console.table(dumpui);
	}
	xls2ui(param){
		var ui = ExcelUtil.excel2ui(param);
		ui.splice(0,8); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}
	ui2xls(){
		//todo. add back spliced 8 lines;
	}

	ui2dm(curve){
		var pretty = function(value){
      		return Math.round(value * 100) / 100;
		}
   
        var series = this.header.cells.map(function(h, i){
        	return {
        		label: h.v,
				isShowCurve: true,
				data: i,
        	}
        })

        var data = [];
        var lineNum = this.header.cells.length;
		var columnNum = this.ui.length;

        for(var i=0; i<lineNum; i++){
        	var line = [];
        	for(var j=0; j<columnNum; j++){
        		line.push(pretty(this.ui[j].cells[i].v));
        	}
        	data.push(line);
        }








		curve.init({
			caption: 'frida test',
			series: series,
			data: data,
		})
	}

	dm2ui(curve){
		this.id = curve.id;
		
		this.ui = [];

		/*var empty = {
			row: {min: 0, max: 7},
			column: {min:0, max:5}
		}
		//empty part.
		for(var i=empty.row.min; i<empty.row.max; i++){
			var cells = [];
			for(var j=empty.column.min; j<empty.column.max; j++){
				cells.push(Cell.create({isHide: true})); //todo: isHide=true???
			}
			this.ui.push(Line.create({cells: cells}));
		}*/


		//datamodel 2 ui.

		var rowNum = curve.data[0].length; //100000
		var columnNum = curve.data.length; //5

		for(var i=0; i<rowNum; i++){
			var cells = [];

			for(var j=0; j<columnNum; j++){
				var v = curve.data[j][i];				
				cells.push(Cell.create({component: Label, v: v}));
			}

			var line = Line.create({cells: cells});
			this.ui.push(line);
		}
	}

}

CurveUI.signal_curve_toggle = new Signal();
module.exports = CurveUI;