
module.exports = class Base {
	constructor(){
		this.ui = undefined;	
		this.sheetName = '';
	}

	tryXls2ui(param){
		var errorCode = -1;
		var errorMsg = '';

		try{
			this.ui = this._xls2ui(param.sheet);
			this.sheetName = param.sheetName;
		}catch(e){
			this.ui = undefined;
			this.sheetName = '';
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg
		}		
	}

	_xls2ui(sheet){
		return Util.excel2ui(sheet);
	}

	ui2dm(project){
	    
	}

	dm2ui(project){
		
	}
}