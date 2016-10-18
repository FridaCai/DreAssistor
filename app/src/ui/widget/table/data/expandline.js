import Line from './line.js';

module.exports = class ExpandLine extends Line {
    static create(param){
        var expandLine = new ExpandLine();
        expandLine.init(param);
        return expandLine;
    }

    init(param){
    	super.init(param); 
    }
    updateByExpand(isOpen, cell){
    	this.cells[0].param.expandComponent = cell.param.expandComponent;
        this.cells[0].param.expandComponentParam = cell.param.expandComponentParam;
    }
    isOpen(){ 
        var brotherLine = this.parent.getBrotherLine(this);
        return brotherLine.isOpen();
    }
}