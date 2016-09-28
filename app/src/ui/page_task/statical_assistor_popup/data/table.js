import Sheet from './sheet.js';

class Table{
	static create(param){
		var table = new Table();
		table.init(param);
		return table;
	}
	constructor(){
		
	}
	init(param){	
		param = param || Table._defaultParam;
		this.sheetNames = param.sheetNames;
		this.sheets = param.sheets.map(function(sheet){
			return Sheet.create(sheet);
		})
	}
	reset(){
		this.init(Table._defaultParam);
	}
	clear(){
		this.sheets[0].clear();
	}
	dump(){
		return this.sheets[0].dump();
	}
	update(param){
		this.sheets[0].update(param);
	}
	insert(param){
		this.sheets[0].insert(param);	
	}
}

Table._defaultParam = {
	sheetNames: ['数值'],
	sheets: [{
		x: [{label:'请拖入数据', path:''}],
		y1: [{label: '请拖入数据', path:''}],
		y2: [{label: '请拖入数据', path:''}]
	}],
	/*sheets: [{
		x: [{label:'A', path:''}, {label:'B', path:''}],
		y1: [{label: '50', path:''}, {label:'100', path:''}],
		y2: [{label: '50', path:''}, {label:'100', path:''}]
	}]*/
};

module.exports = Table;