import Signal from '../../../signal.js';
import GlobalUtil from '../../../util.js';
import RadioGroup from 'RadioGroup';
import {ExpandCell} from 'Table';
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

    getValue(){
        this._getDMValue();
    }
    _getDMValue(){//todo: component.getValue.
        return this._dom ? {} : this._dom.getValue();
    }

	init(param){
		this.id = param.id || GlobalUtil.generateUUID();
		this.v = (param.v == undefined || param.v === null) ? '' : param.v;
        this.isHide = param.isHide || false; //for occupation purpose.
        this.components = param.components || [];

        this._dom = this._createDom();        
	}

    _createDom(){
        

        if(this.isHide){
            return null;
        }

        if(this.components.length === 0){
            return (<Label param={{v: this.v}}/>);
        }

        var dom = null;
        this.components.map((function(component, index){
            switch (component.type){
                case Cell.ComponentEnum.Input:  //todo. input widget.
                    dom = (<Input param={component.param} key={this.id}/>);
                    break;


                    /*return (
                        <input defaultValue={this.v} key={this.id}
                            type='text' 
                            onChange={component.onChange.bind(this)} //todo: onchange and onblur.
                            onBlur={component.onBlur.bind(this)}/>
                    );*/
                case Cell.ComponentEnum.CheckBox:
                    break;
                case Cell.ComponentEnum.ColorBox:
                    break;
                case Cell.ComponentEnum.RadioGroup:
                    dom = (<RadioGroup param={component.param} key={this.id}/>);
                    break;
                case Cell.ComponentEnum.ExpandCell:
                    dom = (<ExpandCell param={component.param} key={this.id}/>);
                    break;
                case Cell.ComponentEnum.ExpandCellTR:
                    dom = (<div ref='expandDiv' className='expandDiv' key={this.id}></div>);
                    break;
                    //return (<ExpandContainer param={component.param} key={this.id}/>);
                default:
                    console.error('undefined cell');
            }
        }).bind(this))

        return dom;
    }
   
    getDom(){
        return this._dom;
        
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
    ExpandCellTR: 'ExpandCellTR',
}
Cell.signal_cell_change = new Signal();
Cell.signal_cell_blur = new Signal();


module.exports = Cell;

