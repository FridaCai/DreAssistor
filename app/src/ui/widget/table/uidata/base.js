import {Util} from 'XlsIExport';
import {Line} from 'Table';

//table, line, cell;
module.exports = class Base {
	constructor(){
		this.ui = [];	
		this.header = [];
		this.sheetName = '';
	}

	xls2ui(param){
		var ui = Util.excel2ui(param);
		ui.splice(0,1); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}

	ui2dm(project){
	    
	}

	dm2ui(project){
		
	}


	//column2line and line2column.
	//todo: header is a problem. no header at all. header is a table dom issue, not datamodel. correct?
	//what about more than oneline header? reference to show header and ui. basic dm remain unchanged.
	/*reverse(){
		var newLines = [];
		var rowNum = this.ui[0].cells.length; //5
		var columnNum = this.ui.length; //251; add header.header might not be only one line.


		for(var i=0; i<rowNum; i++){ //5
			var cells = [];


			cells.push(this.header.cells[i]); //header.
			for(var j=0; j<columnNum; j++){
				var cell = this.ui[j].cells[i];
				cells.push(cell);
			}

			var line = Line.create({cells: cells});
			line.setTable(this);
			newLines.push(line);
		}

		this.ui = newLines;
		this.header = Line.create({cells: []});
	}
	reverseback(){
		var newLines = [];
		var rowNum = this.ui[0].cells.length; //5
		var columnNum = this.ui.length; //251; add header.


		for(var i=0; i<rowNum; i++){ //5
			var cells = [];

			for(var j=1; j<columnNum; j++){
				var cell = this.ui[j].cells[i];
				cells.push(cell);
			}

			var line = Line.create({cells: cells});
			line.setTable(this);
			newLines.push(line);
		}

		this.header = newLines.splice(0,1)
		this.ui = newLines;
	}

	test(){
		console.log('=====init=====');
		this.dump();

		console.log('=====reverse=====');
		this.reverse();
		this.dump();

		console.log('=====reverse back=====');
		this.reverseback();
		this.dump();
	}*/

	dump(){
		var dumpui = [];

		var tmp = [];
		this.header.cells.map(function(cell){
			tmp.push(cell.v);
		})
		dumpui.push(tmp);

		this.ui.map(function(rows){
			tmp = [];
			rows.cells.map(function(cell){
				tmp.push(cell.v)
			})
			dumpui.push(tmp);
		})
		console.table(dumpui);
	}
}