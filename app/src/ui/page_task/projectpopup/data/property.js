import {Util, Cell} from '../../../widget/excel/util.js';
import Base from './base.js';

module.exports = class Property extends Base{
	constructor(){
		super();
		this.header = [Cell.create({v: 'property'}), Cell.create({v: 'value'})];
		this.sheetName = `property`;
	}

	ui2dm(project){
	    for(var i=0; i<this.ui.length; i++){
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

	dm2ui(project){
		var sorp = Util.convertUnixTime2YYYYMMDD(project['sorp']);
		var label = project['label'];
		var bpmax = project['bpmax'];
		var bpmin = project['bpmin'];
		var ec = project['ec'];

		this.ui = [
            [Cell.create({v: 'label'}), Cell.create({v: label})],
            [Cell.create({v: 'bpmax'}), Cell.create({v: bpmax})],
            [Cell.create({v: 'bpmin'}), Cell.create({v: bpmin})],
            [Cell.create({v: 'ec'}), Cell.create({v: ec})],
            [Cell.create({v: 'sorp'}), Cell.create({v: sorp, isEditable: true, id:'sorp'})],
        ];

	}
}