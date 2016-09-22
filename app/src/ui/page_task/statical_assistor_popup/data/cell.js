module.exports = class Cell{
	static create(param){
		var cell = new Cell();
		cell.init(param);
		return cell;
	}
	constructor(){

	}
	init(param){
		this.label = param.label;
		this.path = param.path;
	}
}