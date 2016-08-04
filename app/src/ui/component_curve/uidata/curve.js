import Util from '../../widget/excel/util.js';
import {Base} from 'Table';
import Curve from '../data/curve.js';
import {Cell} from 'Table';
import {Line} from 'Table';
import Label from 'Label';

module.exports = class CurveUI extends Base{ //refactor.
	constructor(){
		super();
		var line = Line.create({cells: [
			Cell.create({component: Label, v: 'rpm'}), 
			Cell.create({component: Label, v: 'OA-level'}), 
			Cell.create({component: Label, v: '2 order'}), 
			Cell.create({component: Label, v: '4 order'}), 
			Cell.create({component: Label, v: '6 order'})
		]});
		this.header = line;

		this.sheetName = `曲线`;
	}
	xls2ui(param){
		var ui = Util.excel2ui(param);
		ui.splice(0,8); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}

	ui2dm(curve){debugger;
		var pretty = function(value){
      		return Math.round(value * 100) / 100;
		}
      	var getColumn = function(columnIndex, arr){
            var returnLabel = [];
            for(var i=0; i<arr.length; i++){
            	var line = arr[i];

              	var cell = line.cells[columnIndex].v;
              	tmp = pretty(tmp);
                returnLabel.push(tmp);
            }
            return returnLabel;
        }

		var labels = getColumn(0, this.ui);
		var series = [{
			label: this.header[1].v,
			isShow: true,
			data: getColumn(1, this.ui),
		}, {
			label: this.header[2].v,
			isShow: true,
			data: getColumn(2, this.ui),
		}, {
			label: this.header[3].v,
			isShow: true,
			data: getColumn(3, this.ui),
		}, {
			label: this.header[4].v,
			isShow: true,
			data: getColumn(4, this.ui),
		}];

		curve.init({
			labels: labels, 
			series: series,
			caption: 'frida test'
		})
	}

	dm2ui(curve){
		var empty = {
			row: {min: 0, max: 7},
			column: {min:0, max:5}
		}
		this.ui = [];

		//empty part.
		for(var i=empty.row.min; i<empty.row.max; i++){
			var cells = [];
			for(var j=empty.column.min; j<empty.column.max; j++){
				cells.push(Cell.create({isHide: true})); //todo: isHide=true???
			}
			this.ui.push(Line.create({cells: cells}));
		}


		//datamodel 2 ui.
		var loop = curve.labels.length;
		for(var i=0; i<loop; i++){
			var cells = [
				Cell.create({component: Label, v: curve.labels[i]}),
				Cell.create({component: Label, v: curve.series[0].data[i]}),
				Cell.create({component: Label, v: curve.series[1].data[i]}),
				Cell.create({component: Label, v: curve.series[2].data[i]}),
				Cell.create({component: Label, v: curve.series[3].data[i]})
			];
			this.ui.push(Line.create({cells: cells}));
		}
	}

	dump(){
		var dumpui = [];

		this.ui.map(function(rows){
			var tmp = [];
			rows.map(function(cell){
				tmp.push(cell.v)
			})
			dumpui.push(tmp);
		})

		console.table(dumpui);
	}
}