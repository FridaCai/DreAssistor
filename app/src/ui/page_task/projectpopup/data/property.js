import {ExcelUtil} from 'XlsIExport';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';

class Property extends Base{
	constructor(){
		super();

		this.header = new Line({
			cells: [Cell.create({v: 'property'}), Cell.create({v: 'value'})],
		});

		this.sheetName = `项目属性`;
	}

	ui2dm(project){
	    for(var i=0; i<this.ui.length; i++){
	        var line = this.ui[i];
	        var key = line.getCellAt(0).getValue();
	        var value = line.getCellAt(1).getValue();

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
	                project[key] = ExcelUtil.convertYYYYMMDD2UnixTime(value);
	        }
	    }
	}

	dm2ui(project){
		var sorp = ExcelUtil.convertUnixTime2YYYYMMDD(project['sorp']);
		var label = project['label'];
		var bpMax = project['bpMax'];
		var bpMin = project['bpMin'];
		var massMax = project['massMax'];
		var massMin = project['massMin'];
		var ec = project['ec'];

		this.ui = [//todo. LIne.
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