import {Util, Cell} from '../../../widget/excel/util.js';

module.exports = class Property {
	constructor(){
		this.ui = undefined;	
		this.sheetName = undefined;
	}

	checkSheet(sheet){
		var errorCode = -1;
		var errorMsg = '';

		try{
			this._importFromSheet(sheet);
		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg
		}		
	}

	initBySheet(sheetName){
		this.sheetName = sheetName;
	}

	_importFromSheet(sheet){
		this.ui = Util.excel2ui(sheet);
	}

	_exportToDataModel(project){
	    for(var i=1; i<this.ui.length; i++){
	        var line = this.ui[i];
	        var key = line[0].v;
	        var value = line[1].v;

	        switch(key){
	            case 'label':
	            case 'ec':
	                project[key] = value;
	                break;
	            case 'bpmax':
	            case 'bpmin':
	                project[key] = Math.round(parseFloat(value) * 100) / 100;
	                break;
	            case 'sorp':
	                project[key] = Util.convertYYYYMMDD2UnixTime(value);
	        }
	    }
	}

//problem here. (new Cell()).init() return undefined
	importFromDataModel(project){
		this.ui = [
            [(new Cell()).init({v: 'property'}), (new Cell()).init({v: 'value'})],
            [(new Cell()).init({v: 'label'}), (new Cell()).init({v: project['label']})],
            [(new Cell()).init({v: 'bpmax'}), (new Cell()).init({v: project['bpmax']})],
            [(new Cell()).init({v: 'bpmin'}), (new Cell()).init({v: project['bpmin']})],
            [(new Cell()).init({v: 'ec'}), (new Cell()).init({v: project['ec']})],
            [(new Cell()).init({v: 'sorp'}), (new Cell()).init({v: Util.convertUnixTime2YYYYMMDD(project['sorp']), isEditable: true, ref:'sorp'})],
        ];
	}
}