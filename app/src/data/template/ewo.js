module.exports = class EWO{
	static create(param){
		var ewo = new EWO();
		ewo.init(param);
		return ewo;
	}
	constructor(){
	}
	init(param){
		this.type = param.type;
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
		ewo.init(this.dump())
		return ewo;
	}
}

