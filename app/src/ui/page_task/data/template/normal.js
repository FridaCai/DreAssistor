module.exports = class Normal{
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
		var normal = new Normal();
		normal.init({});
		return normal;
	}
}