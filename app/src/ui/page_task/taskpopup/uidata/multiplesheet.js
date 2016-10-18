import MultipleParamUIData from './multipleparam.js';
import TmpUtil from "TmpUtil";
import Signal from 'Signal';

class MultipleSheetUIData extends Array{
	constructor(){
		super();
		this.signal_expand_toggle = new Signal();
		this.signal_data_change = new Signal();
	}
	
	dm2ui(project, dm){ 
		this.length = 0;
		try{
			for(var i=0; i<dm.sheets.length; i++){
				var sheet = dm.sheets[i];
				var sheetName = dm.sheetNames[i];
										
				var multipleparam = new MultipleParamUIData();
				multipleparam.components = TmpUtil.getComponents(sheet);
				multipleparam.setHeader();
				multipleparam.setSheetName(sheetName);
				multipleparam.dm2ui(project, sheet);

				multipleparam.signal_expand_toggle.listen((function(){
					this.onExplandToggle();
				}).bind(this));
				multipleparam.signal_data_change.listen((function(){
					this.onDataChange();
				}).bind(this));

				this.push(multipleparam);
			}
		}catch(e){
			console.error(e);
		}
	}
	ui2dm(dm){
		this.map((function(multipleparam,index){
			multipleparam.ui2dm(dm.sheets[index]);
		}).bind(this));
	}
	onExplandToggle(){
		this.signal_expand_toggle.dispatch();
	}
	onDataChange(){
		this.signal_data_change.dispatch();
	}
}
module.exports = MultipleSheetUIData;





