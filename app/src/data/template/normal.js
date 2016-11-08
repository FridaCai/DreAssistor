module.exports = class Normal{
	static create(){
		var normal = new Normal();
		normal.init();
		return normal;
	}
	constructor(){
	}
	init(){
		this.type = 0;
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
		var normal = new Normal();
		normal.init();
		return normal;
	}
}
