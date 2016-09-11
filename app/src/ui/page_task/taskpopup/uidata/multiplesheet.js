import MultipleParamUIData from './multipleparam.js';
class MultipleSheetUIData{
	constructor(){
		this.uidata = {};
	}
	
	dm2ui(project, dm){ 
		try{
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
		}catch(e){
			console.error(e);
		}
		
	}
	ui2dm(dm){
		Object.keys(this.uidata).map((function(key,index){
			this.uidata[key].ui2dm(dm.sheets[index]);
		}).bind(this));
	}
}
module.exports = MultipleSheetUIData;





