module.exports = class EWO{
	static create(){
		var ewo = new EWO();
		ewo.init();
		return ewo;
	}
	constructor(){
	}
	init(){
		this.type = 1;
		this.sheets = [];
		this.sheetNames = [];
	}
	dump(){
		return {
			type: this.type,
			sheetNames: this.sheetNames,
			sheets: this.sheets,
		}
	}
	clone(){
		var ewo = new EWO();
		ewo.init();
		return ewo;
	}
}

