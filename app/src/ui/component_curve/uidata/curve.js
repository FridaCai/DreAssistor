import Base from '../../page_task/projectpopup/data/base.js';
import Util from '../../widget/excel/util.js';
import {Cell} from 'Table';
import Curve from '../data/curve.js';

module.exports = class CurveUI extends Base{ //refactor.
	constructor(){
		super();

		this.header = [
			Cell.create({v: 'rpm'}), 
			Cell.create({v: 'OA-level'}), 
			Cell.create({v: '2 order'}), 
			Cell.create({v: '4 order'}), 
			Cell.create({v: '6 order'})
		];

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
      	var getColumn = function(columnIndex, arr){
            var returnLabel = [];
            for(var i=0; i<arr.length; i++){
              	var tmp = arr[i][columnIndex].v;
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
		debugger; //create mock up data. curve by default.
	}

	dm2ui(curve){
		var empty = {
			row: {min: 0, max: 7},
			column: {min:0, max:5}
		}
		this.ui = [];

		//empty part.
		for(var i=empty.row.min; i<empty.row.max; i++){
			var row = [];
			for(var j=empty.column.min; j<empty.column.max; j++){
				row.push(Cell.create({isHide: true})); //todo: isHide=true???
			}
			this.ui.push(row);
		}


		//datamodel 2 ui.
		var loop = curve.labels.length;
		for(var i=0; i<loop; i++){
			var row = [
				Cell.create({v: curve.labels[i]}),
				Cell.create({v: curve.series[0].data[i]}),
				Cell.create({v: curve.series[1].data[i]}),
				Cell.create({v: curve.series[2].data[i]}),
				Cell.create({v: curve.series[3].data[i]})
			];
			this.ui.push(row);
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