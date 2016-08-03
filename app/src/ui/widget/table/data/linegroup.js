class LineGroup {
    static create(param){
        var lineGroup = new LineGroup();
        lineGroup.init(param);
        return lineGroup;
    }

	constructor(){
	   this.lines = [];
	}

	getCells(){
		var cells = [];

		this.lines.map(function(line){
			cells = cells.concat(line.cells);
		})

		return cells;
	}

	init(param){
		this.lines = param.lines;
		/*this.getCells().map((function(cell){ 
			if(cell.hasExpandCell()){
				//when to unlisten???
				cell.signal_expand_toggle.listen((function(e, param){
					this.lines[0].updateDOM(param); 
					this.lines[1].updateDOM(param);

					cell.update(isOpen);
				}).bind(this))
			}
		}).bind(this))*/

	}
}

module.exports = LineGroup;