import {Util} from 'XlsIExport';
import GlobalUtil from 'Util';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Label from 'Label';
import Curve from '../data/curve.js';
import ColorCheckbox from '../widget/colorcheckbox.js';

module.exports = class CurveUI extends Base{ //refactor.
	constructor(){
		super();

		var colorIndex = 0;
		var line = Line.create({cells: [
			Cell.create({component: Label, v: 'rpm'}), 
			Cell.create({component: ColorCheckbox, param: {color: GlobalUtil.COLORS[colorIndex++ % 24], isCheck: false, label: 'OA-level'}, v: 'OA-level'}),
			Cell.create({component: ColorCheckbox, param: {color: GlobalUtil.COLORS[colorIndex++ % 24], isCheck: false, label: '2 order'}, v: '2 order'}),
			Cell.create({component: ColorCheckbox, param: {color: GlobalUtil.COLORS[colorIndex++ % 24], isCheck: false, label: '4 order'}, v: '4 order'}),
			Cell.create({component: ColorCheckbox, param: {color: GlobalUtil.COLORS[colorIndex++ % 24], isCheck: false, label: '6 order'}, v: '6 order'}),
		]});
		this.header = line;
		this.sheetName = `曲线`;
	}
	xls2ui(param){
		var ui = Util.excel2ui(param);
		ui.splice(0,8); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}

	ui2dm(curve){
		var pretty = function(value){
      		return Math.round(value * 100) / 100;
		}
      	var getColumn = function(columnIndex, rowMinIndex, rowMaxIndex, arr){
            var returnLabel = [];
            for(var i=rowMinIndex; i<=rowMaxIndex; i++){
            	var line = arr[i];

              	var cell = line.cells[columnIndex].v;
              	tmp = pretty(tmp);
                returnLabel.push(tmp);
            }
            return returnLabel;
        }

        var series = this.header.cells.map(function(h, i){
        	return {
        		label: h.v,
				isShow: true,
				data: i,
        	}
        })

        var data = this.header.cells.map(function(h, i, arr){
        	var columnIndex = i;
        	var rowMinIndex = 1;
        	var rowMaxIndex = arr.length - 1;
        	return getColumn(columnIndex, rowMinIndex, rowMaxIndex, arr);
        })
		
		curve.init({
			caption: 'frida test',
			series: series,
			data: data,
		})
	}

	dm2ui(curve){
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

	dump(){
		var dumpui = [];

		this.ui.map(function(rows){
			var tmp = [];
			rows.cells.map(function(cell){
				tmp.push(cell.v)
			})
			dumpui.push(tmp);
		})
		console.table(dumpui);
	}
}