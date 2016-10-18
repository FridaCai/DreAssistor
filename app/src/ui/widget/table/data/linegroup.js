import GlobalUtil from 'Util';
import {Util, Line, ExpandLine} from 'Table';

//multiple lines. eg: project property, project engine...
class LineGroup {
    static create(param){
        var lineGroup = new LineGroup();
        lineGroup.init(param);
        return lineGroup;
    }

	init(param){
		this.id = param.id || GlobalUtil.generateUUID();
		this.lines = param.lines;
		this.parent = param.parent;

		this.lines.map((function(line){
			line.parent = this;
		}).bind(this))
	}
	updateByExpand(isOpen, cell){
		this.parent.updateByExpand(isOpen, cell);
	}
	getBrotherLine(line){
		return Util.getBrotherLine(line, this.lines);
	}
	closeExpand(isOpen, cell){
		this.lines.map(function(line){
			line.closeExpand();
		})
	}
	dumplines4xls(){
		var lines = [];
		this.lines.map(function(obj){
			if(obj instanceof Line && !(obj instanceof ExpandLine)){
				lines.push(obj);
			}
		})
		return lines;
	}
}
module.exports = LineGroup;