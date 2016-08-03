import Line from './line.js';

module.exports = class ExpandLine extends Line {
    static create(param){
        var expandLine = new ExpandLine();
        expandLine.init(param);
        return expandLine;
    }
}