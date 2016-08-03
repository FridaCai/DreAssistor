import ExpandCell from './expandcell.js';
import Util from 'Util';
import Signal from 'Signal';

class Line {
    static create(param){
        var line = new Line();
        line.init(param);
        return line;
    }

	init(param){
		this.id = param.id || Util.generateUUID();
		this.cells = param.cells;
        this._dom = this._createDom(); 


        this.signal_expand_toggle = new Signal();

        this.cells.map((function(cell){
        	if(cell instanceof ExpandCell){
        		cell.signal_expand_toggle.listen((function(){
	        		this.signal_expand_toggle.dispatch();
	        	}).bind(this));	
        	}
        }).bind(this));
	}
	
	getCellAt(i){
		return this.cells[i];
	}
	constructor(){
	   this.cells = [];
	}
}

module.exports = Line;