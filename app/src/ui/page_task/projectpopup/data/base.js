import {Util} from '../../../widget/excel/util.js';

module.exports = class Base {
	constructor(){
		this.ui = [];	
		this.header = [];
		this.sheetName = '';
	}

	xls2ui(param){
		this.ui = Util.excel2ui(param.sheet);
		this.ui.splice(0,1);
	}

	ui2dm(project){
	    
	}

	dm2ui(project){
		
	}
}