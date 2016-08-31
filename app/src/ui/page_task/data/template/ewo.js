module.exports = class EWO{
	constructor(){
	}
	init(param){
		
	}
	dump(){
		return {
			sheetNames: [],
			sheets: []
		}
	}
	clone(){
		var ewo = new EWO();
		ewo.init({})
		return ewo;
	}
}