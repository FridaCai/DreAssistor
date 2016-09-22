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
	dump(){
		return {
			x: this.x.map(function(cell){
				return cell.dump()
			}),
			y1: this.y1.map(function(cell){
				return cell.dump()
			}),
			y2: this.y2.map(function(cell){
				return cell.dump()
			})
		}
	}
	clear(){
		this.x.length = 0;
		this.y1.length = 0;
		this.y2.length = 0;
	}
	appendLine(){
		this.x.push(Cell.create());
		this.y1.push(Cell.create());
		this.y2.push(Cell.create());
	}
	update(param){
		var {index, xCell, y1Cell, y2Cell} = param;
		this.x[index].update(xCell);
		this.y1[index].update(y1Cell);
		this.y2[index].update(y2Cell);
	}
	insert(param){
		var {xCell, y1Cell, y2Cell} = param;
		this.x.push(Cell.create(xCell));
		this.y1.push(Cell.create(y1Cell));
		this.y2.push(Cell.create(y2Cell));
	}
}