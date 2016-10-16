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
		this.parent = param.parent;
	}
	
	setId(id){
		this.id = id;
	}
	getCellAt(index){
		return this.cells[index];
	}

	constructor(){
	}

	isOpen(){
		for(var i=0; i<this.cells.length; i++){
            var cell = this.cells[i];
            if(cell.param.isOpen){
                return true;
            }
        }
        return false;
	}
	
}

module.exports = Line;