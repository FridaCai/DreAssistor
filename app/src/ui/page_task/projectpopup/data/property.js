import {Util, Cell} from '../../../widget/excel/util.js';
import Base from './base.js';
import Signal from '../../../../signal.js';

class Property extends Base{
	constructor(){
		super();
		this.header = [Cell.create({v: 'property'}), Cell.create({v: 'value'})];
		this.sheetName = `项目属性`;
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
	            case 'bpMax':
	            case 'bpMin':
	            case 'massMin':
	            case 'massMax':
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
		var bpMax = project['bpMax'];
		var bpMin = project['bpMin'];
		var massMax = project['massMax'];
		var massMin = project['massMin'];
		var ec = project['ec'];

		this.ui = [
            [Cell.create({v: 'label'}), Cell.create({v: label})],
            [Cell.create({v: 'bpMax'}), Cell.create({v: bpMax})],
            [Cell.create({v: 'bpMin'}), Cell.create({v: bpMin})],
            [Cell.create({v: 'massMax'}), Cell.create({v: massMax})],
            [Cell.create({v: 'massMin'}), Cell.create({v: massMin})],
            [Cell.create({v: 'ec'}), Cell.create({v: ec})],
            [
            	Cell.create({v: 'sorp'}), 
            	Cell.create({
	            	id:'sorp', 
	            	v: sorp,
	            	components:[{
		        		type: Cell.ComponentEnum.Input,
		        		onChange: function(e){
		        			var value = e.target.value;
		        			Property.signal_sorp_change.dispatch({cell: this, value: value});	

		        		},
		        		onBlur: function(e){
		        			Property.signal_sorp_blur.dispatch();
		        		}
		        	}]
        		})
    		]
        ];
	}
}

Property.signal_sorp_change = new Signal();
Property.signal_sorp_blur = new Signal();

module.exports = Property;