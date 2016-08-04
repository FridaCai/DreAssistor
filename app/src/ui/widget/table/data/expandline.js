import Line from './line.js';

module.exports = class ExpandLine extends Line {
    static create(param){
        var expandLine = new ExpandLine();
        expandLine.init(param);
        return expandLine;
    }

    init(param){
    	super.init(param); //todo: check es6

    	this.isOpen = false;
    }
    updateByExpand(isOpen, cell){
    	this.isOpen = isOpen;
    	this.cells[0].param.expandComponent = cell.param.expandComponent;
    }
}