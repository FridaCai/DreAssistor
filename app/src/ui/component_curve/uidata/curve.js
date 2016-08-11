import {ExcelUtil} from 'XlsIExport';
import GlobalUtil from 'Util';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Label from 'Label';
import Curve from '../data/curve.js';
import ColorCheckbox from '../widget/colorcheckbox.js';


class CurveUI extends Base{ 
	constructor(){
		super();
		
		var me = this;
		var colorIndex = 0;
		var createLine = function(label){
			return Cell.create({
				component: ColorCheckbox, 
				param: {
					color: GlobalUtil.COLORS[colorIndex++ % 24], 
					isCheck: true, 
					label: label,  
					onCheckboxChange: function(isCheck){
						this.param.isCheck = isCheck;
						me.onToggle();
					},
				}, 
				v: label,
			});
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


		/*
		this.ui.map(function(line){
			var tmp = [];
			line.cells.map(function(cell){
				tmp.push(`${cell.v}`);
			})
			dumpui.push(tmp);
		})
*/
		console.table(dumpui);
	}
	xls2ui(param){
		var ui = ExcelUtil.excel2ui(param);
		ui.splice(0,8); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}
	ui2xls(){
		//should not change this.ui data.

		var hiddenColumns = this.header.cells.map(function(cell, index){
			if(cell.component.displayName === 'ColorCheckbox' && !cell.param.isCheck){
				return index;
			}
			return -1;
		})

		function filter(arr){
			return arr.filter(function(cell, index){
				if(hiddenColumns.indexOf(index) != -1){
					return false;
				}
				return true;
			})
		}

		var header = Line.create({cells: filter(this.header.cells)});
		var ui = [];
		this.ui.map(function(line, i){
			ui.push(
				Line.create({
					cells: filter(line.cells)
				})
			);
		})













		var emptylines = (function appendEmptyLines(){
			var emptylines = [];
			for(var i=0; i<8; i++){
				var cells = [];
				for(var j=0; j<5; j++){
					cells.push(Cell.create({component: Label, v: ''}));
				}
				emptylines.push(Line.create({cells: cells}));
			}
			return emptylines;
		})()
		
		ExcelUtil.ui2excel({
			curve: {
				appendLines: emptylines, 
				header: header,
				ui: ui,
			}
		});
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
		var rowNum = curve.data[0].length; 
		var columnNum = curve.data.length; 

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


module.exports = CurveUI;