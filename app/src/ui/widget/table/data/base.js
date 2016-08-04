import {Util} from 'XlsIExport';
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
}