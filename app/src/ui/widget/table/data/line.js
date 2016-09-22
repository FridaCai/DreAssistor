import Util from 'Util';

class Line {
    static create(param){
        var line = new Line();
        line.init(param);
        return line;
    }

	init(param){
		this.id = param.id || Util.generateUUID();
		
		this.meta = {}; //for other non-ui properties. eg: properyt key.
		if(param.meta && param.meta.key){
			this.meta.key = param.meta.key;
		}

		this.cells = param.cells;
		this.cells.map((function(cell){
			cell.setLine(this);
		}).bind(this));
		this.expandLine = param.expandLine;

	}
	
	setId(id){
		this.id = id;
	}
	getCellAt(index){
		return this.cells[index];
	}

	constructor(){
	}

	updateByExpand(isOpen, cell){
		this.cells.map(function(cell){
			if(cell.component.displayName === 'ExpandCellDOM'){
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