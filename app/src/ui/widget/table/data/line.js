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
	}
	
	constructor(){
	   this.cells = [];
	}
}

module.exports = Line;