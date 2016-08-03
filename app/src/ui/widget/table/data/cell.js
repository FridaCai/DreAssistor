//todo. clear import;

import Signal from 'Signal';
import GlobalUtil from 'Util';
import RadioGroup from 'RadioGroup';
import {ExpandCell} from 'Table';
import {ExpandContainer} from 'Table';

import Input from 'Input';
import Label from 'Label';

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
        this.param = param.param || null;
        this.isHide = param.isHide || false; //for occupation purpose.
        this.v = (param.v == undefined || param.v === null) ? '' : param.v;
        //this.components = param.components || []; //todo: components -> component.
	}
  
    //todo: need?
    /*hasExpandCell(){
        if(this.components.length === 0)
            return false;
        if(this.components[0].type === Cell.ComponentEnum.ExpandCell)
            return true;
        return false;
    }*/
  
    dump(){
        return {
            value: this.v,
        }
    }

}

//todo: clear.
/*Cell.ComponentEnum = {
    Input: 'Input',
    CheckBox: 'CheckBox',
    ColorBox: 'ColorBox',
    RadioGroup: 'RadioGroup',
    ExpandCell: 'ExpandCell',
    ExpandCellTR: 'ExpandCellTR',
}*/
//Cell.signal_input_change = new Signal();
//Cell.signal_input_blur = new Signal();

module.exports = Cell;

