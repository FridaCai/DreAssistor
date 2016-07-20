import {Util} from '../../../widget/excel/util.js';

module.exports = class Base {
	constructor(){
		this.ui = undefined;	
		this.sheetName = '';
	}

	xls2ui(param){
		this.ui = Util.excel2ui(param.sheet);
		this.sheetName = param.sheetName;
	}

	ui2dm(project){
	    
	}

	dm2ui(project){
		
	}
}