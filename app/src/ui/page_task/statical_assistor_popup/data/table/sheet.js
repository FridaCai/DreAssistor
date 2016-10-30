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
	deleteAt(index){
		this.x.splice(index, 1);
		this.y1.splice(index, 1);
		this.y2.splice(index, 1);
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
	insertAt(param, index){
		this.x.splice(index, 0, param.x);
		this.y1.splice(index, 0, param.y1);
		this.y2.splice(index, 0, param.y2);
	}
	move(startIndex, endIndex){
		var param = {
			x: this.x[startIndex],
			y1: this.y1[startIndex],
			y2: this.y2[startIndex]
		}
		if(startIndex > endIndex){
			this.deleteAt(startIndex);
			this.insertAt(param, endIndex);
			//insert
		}else{
			this.insertAt(param, endIndex);
			this.deleteAt(startIndex);
		}
	}
}