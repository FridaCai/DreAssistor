module.exports = class Normal{
	static create(param){
		var normal = new Normal();
		normal.init(param);
		return normal;
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
		var normal = new Normal();
		normal.init(this.dump());
		return normal;
	}
}
