//todo: deprecated???
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
		
		this.getCells().map((function(cell){
			if(cell.hasExpandCell()){
				//when to unlisten??? //todo. frida . problem here.

				cell.signal_expand_toggle.listen((function(e, param){
					var isOpen = param.isOpen;
					var cell = param.cell;


					this.lines[0].updateByExpand(isOpen, cell); 
					this.lines[1].updateByExpand(isOpen, cell);

					
				}).bind(this))
			}
		}).bind(this))

	}
}

module.exports = LineGroup;