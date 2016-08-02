class LineGroup {
    static create(param){
        var lineGroup = new LineGroup();
        lineGroup.init(param);
        return lineGroup;
    }

	constructor(){
	   this.lines = [];
	}

	init(param){
		this.lines = param.lines;

		this.lines[0].signal_expand_toggle.listen((function(param){
			var cellIndex = param.cellIndex; //-1: close. 0-cells.length, which cell is triggered. cell can also be passed.
			this.lines[0].update(cellIndex); //todo: cellIndex is not the correct param.
			this.lines[1].update(cellIndex);
		}).bind(this));
	}
}

module.exports = LineGroup;