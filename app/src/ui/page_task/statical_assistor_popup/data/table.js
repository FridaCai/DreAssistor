import Sheet from './sheet.js';

module.exports = class Table{
	static create(param){
		var table = new Table();
		table.init(param);
		return table;
	}
	constructor(){
		this._defaultParam = {
			sheetNames: ['数值'],
			sheets: [{
				x: [{label:'请拖入数据', path:''}],
				y1: [{label: '请拖入数据', path:''}],
				y2: [{label: '请拖入数据', path:''}]
			}]
		};
	}
	init(param){	
		param = param || this._defaultParam;
		this.sheetNames = param.sheetNames;
		this.sheets = param.sheets.map(function(sheet){
			return Sheet.create(sheet);
		})
	}
	reset(){
		this.init(this._defaultParam);
	}
}


	