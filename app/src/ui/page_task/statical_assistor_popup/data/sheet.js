import Cell from './cell.js';
module.exports = class Sheet{
	static create(param){
		var sheet = new Sheet();
		sheet.init(param);
		return sheet;
	}
	constructor(){

	}
	init(param){
		this.x = param.x.map(function(param){
			return Cell.create(param);
		})
		this.y1 = param.y1.map(function(param){
			return Cell.create(param);
		})
		this.y2 = param.y2.map(function(param){
			return Cell.create(param);
		})
	}
}