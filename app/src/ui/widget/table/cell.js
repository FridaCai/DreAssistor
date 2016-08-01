import Signal from '../../../signal.js';
import GlobalUtil from '../../../util.js';

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
		this.v = (param.v == undefined || param.v === null) ? '' : param.v;
        this.isHide = param.isHide || false; //for occupation purpose.
        this.components = param.components || [];
	}
    //todo:
    needExpand(){
        if(this.components.length === 0){
            return false;
        }
    }
    //todo:
    setExpand(){

    }
    getDom(){
        if(this.isHide){
            return null;
        }
        if(this.components.length === 0){
            return (<span title={this.v}>{this.v}</span>);
        }


        var scope = {};
        return (
            <div className='cellGroup'>
            {
                this.components.map((function(component, index){
                    switch (component.type){
                        case Cell.ComponentEnum.Input: 
                            return (
                                <input defaultValue={this.v} key={this.id}
                                    type='text' 
                                    onChange={component.onChange.bind(this)} //todo: onchange and onblur.
                                    onBlur={component.onBlur.bind(this)}/>
                            );
                            break;
                        case Cell.ComponentEnum.CheckBox:
                            //todo.
                            return null;
                            break;
                        case Cell.ComponentEnum.ColorBox:
                            return null; //todo.
                            break;
                        case Cell.ComponentEnum.RadioGroup:
                            return null; //todo.
                            break;
                        case Cell.ComponentEnum.ExpandCell:
                            return null;
                            break;
                    }
                }).bind(this))
            }
            </div>
        )
    }
    dump(){
        return {
            v: this.v,
        }
    }

}

Cell.ComponentEnum = {
    Input: 'Input',
    CheckBox: 'CheckBox',
    ColorBox: 'ColorBox',
    RadioGroup: 'RadioGroup',
    ExpandCell: 'ExpandCell',
}
Cell.signal_cell_change = new Signal();
Cell.signal_cell_blur = new Signal();


module.exports = Cell;