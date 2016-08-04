import Signal from 'Signal';
import GlobalUtil from 'Util';
import {ExpandCellDOM} from 'Table';

class Cell {
    static create(param){
        var cell = new Cell();
        cell.init(param);
        return cell;
    }

	constructor(){

	}

	init(param){
		this.id = param.id || GlobalUtil.generateUUID();
		this.component = param.component || null;
        this.param = param.param || {}; 
        this.isHide = param.isHide || false; //for occupation purpose.
        this.v = (param.v == undefined || param.v === null) ? '' : param.v;
        
        this.line = undefined;
	}
  

    setLine(line){
        this.line = line;
    }
  
    dump(){
        return {
            value: this.v,
        }
    }

}

//Cell.signal_input_change = new Signal();
//Cell.signal_input_blur = new Signal();

module.exports = Cell;

