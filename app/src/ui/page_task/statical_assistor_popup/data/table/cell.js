class Cell{
	static create(param){
		var cell = new Cell();
		cell.init(param);
		return cell;
	}
	constructor(){
	}
	init(param){
		this._updateMeta(param);
	}
	dump(){
		return {
			label: this.label,
			path: this.path
		}
	}
	update(param){
		this._updateMeta(param);
	}
	_updateMeta(param){
		param = param || Cell.defaultCellObj;
		this.label = param.label;
		this.path = param.path;
	}
}
Cell.defaultCellObj = {label:'请拖入数据', path:''};

module.exports = Cell;