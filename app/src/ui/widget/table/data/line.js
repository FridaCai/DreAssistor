import Util from 'Util';
import {ExpandCellDOM} from 'Table';

class Line {
    static create(param){
        var line = new Line();
        line.init(param);
        return line;
    }

	init(param){
		this.id = param.id || Util.generateUUID();
		

		this.cells = param.cells;
		this.cells.map((function(cell){
			cell.setLine(this);
		}).bind(this));


		this.expandLine = param.expandLine;

	}
	
	constructor(){
	}

	updateByExpand(isOpen, cell){
		this.cells.map(function(cell){
			if(cell.component instanceof ExpandCellDOM){
				cell.param.isOpen = false;
			}
		});

		if(!isOpen){
			return;
		}

		if(cell){
			cell.param.isOpen = true;
		}
	}
}

module.exports = Line;