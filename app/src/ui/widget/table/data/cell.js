import GlobalUtil from 'Util';

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
        this.param.scope = this;
        
        if(this.param.expandComponentParam){
            this.param.expandComponentParam.scope=this;
        }


        this.isHide = param.isHide || false; //for occupation purpose. deprecated?
        //this.v = (param.v == undefined || param.v === null) ? '' : param.v;
        this.v = param.v;
        this.line = param.line || null;
	}

    setLine(line){
        this.line = line;
    }
  
    dump(){
        return {
            value: this.v,
        }
    }

    getValue(){
        //var v =  (this.v && typeof this.v.dump === 'function' ? this.v.dump(): this.v);

        return this.v;
    }

}
module.exports = Cell;

