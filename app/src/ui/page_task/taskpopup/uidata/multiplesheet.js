import MultipleParamUIData from './multipleparam.js';
import {Cell} from 'Table';
import {Line} from 'Table';
import Label from 'Label';

class MultipleSheetUIData{
	constructor(){
		this.uidata = {};
	}
	ui2dm(dm){
		
	}
	dm2ui(project, dm){ 
		for(var i=0; i<dm.sheets.length; i++){
			var sheet = dm.sheets[i];
			var sheetName = dm.sheetNames[i];
									
			var multipleparam = new MultipleParamUIData();
			multipleparam.setComponents(sheet);
			multipleparam.setHeader();
			multipleparam.setSheetName(sheetName);
			multipleparam.dm2ui(project, sheet);

			this.uidata[i] = multipleparam;
		}
	}
	ui2dm(dm){
		debugger;
		Object.keys(this.uidata).map((function(key){
			this.uidata[key].ui2dm(dm);
		}).bind(this));
	}
}

//MultipleSheetUIData.signal_expand_toggle = new Signal();

module.exports = MultipleSheetUIData;





