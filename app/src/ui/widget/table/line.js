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

	_createDom(){
		var percentage = (function(line){
			var cells = line.cells;
	        var tmp = cells.filter(function(cell){
	            return !cell.isHide;
	        })
	        return `${(1/tmp.length)*100}%`;
		})(this)

		return (
			<tr key={this.id}>
			{
				this.cells.map(function(cell){
					if(!cell.isHide){
						return ((
		                    <td key={cell.id} style={{width:percentage}}>{cell.getDom()}</td>
		                ));    
					}
				})
			}
			</tr>
		)
	}

	getDom(){
		return this._dom;
	}
	getCellAt(i){
		return this.cells[i];
	}
	constructor(){
	   this.cells = [];
	}
}

module.exports = Line;