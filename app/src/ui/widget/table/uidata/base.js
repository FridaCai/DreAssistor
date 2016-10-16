import {Util} from 'XlsIExport';
import {Line, Cell} from 'Table';
import Signal from 'Signal';
import ExpandLine from '../data/expandline';


module.exports = class Base {
	constructor(){
		this.ui = [];	
		this.header = new Line();
		this.sheetName = '';

		this.signal_data_change = new Signal();
		this.signal_expand_toggle = new Signal();
	}

	xls2ui(param){
		var ui = Util.excel2ui(param);
		ui.splice(0,1); //todo: bad. assume only one line for header...search for a better solution...
		this.ui = this.ui.concat(ui);
	}

	ui2dm(){}
	dm2ui(){}

	setSheetName(sheetName){
		this.sheetName = sheetName;
	}
	
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
	}
	updateByExpand(isOpen, cell){
		this.ui.map(function(line){
			line.cells.map(function(cell){
				cell.param.isOpen = false;
			})
		})	
		if(isOpen){
			cell.param.isOpen = true;
		}
	}
	getBrotherLine(line){
		var curIndex;
		for(var i=0; i<this.ui.length; i++){
			var l = this.ui[i];
			if(l.id === line.id){
				curIndex = i;
				break;
			}
		}

		if(line instanceof ExpandLine){
			return this.ui[curIndex-1];			
		}else if(line instanceof Line){
			return this.ui[curIndex+1];
		}
	}
}