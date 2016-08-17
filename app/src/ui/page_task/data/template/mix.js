import {Attachments} from '../attachments.js';

exports.COMPONENT_ENUM = {
	'LABEL': 'label',
	'STATUS': 'status',
	'REFKEY': 'refKey',
	'ATTACHMENTS': 'attachments',
	'VALUE': 'value',
	'CURVE': 'curve',
	'IMAGES': 'images',
	'TEXT': 'text',
	'DROPDOWN': 'dropdown'
}


exports.COMPONENT_LABEL_ENUM = {
	'label': "属性",
	'status': '状态',
	'refKey': '目标',
	'attachments': '附件',
	'value': '数值',
	'curve': '曲线',
	'images':'图片',
	'text': '文本',
	'dropdown':"选项"
}

class SingleParam{
	static create(param){
		var singleParam = new SingleParam();
		singleParam.init(param);
		return singleParam;
	}
	constructor(){

	}
	init(param){ 
		//undefined -- not need this property; 
		//null -- just empty in template, to be set value.
		this.label = param.label
		this.status = param.status;
		this.refKey = param.refKey;
		this.attachments =  param.attachments;
		this.value = param.value;
		this.curve = param.curve;
		this.images = param.images;
		this.text = param.text;
		this.dropdown = param.dropdown;
	}

	clone(){
		var singleParam = new SingleParam();
		var param = this.dump();
		singleParam.init(param);
		return singleParam;
	}
	dump(){
		return {
			label: this.label,
			status: this.status,
			refKey: this.refKey,
			attachments: this.attachments,
			value: this.value,
			curve: this.curve,
			images: this.images,
			text: this.text,
			dropdown: this.dropdown
		}
	}
}

class MultipleParam{
	constructor(){

	}
	init(param){
		Object.keys(param).map((function(key){
			var value = param[key];
			this[key] = new SingleParam.create(value);
		}).bind(this));
	}

	dump(){
		var obj = {};
		Object.keys(this).map((function(key){
			var value = this[key];
			if(value instanceof SingleParam){
				obj[key] = value.dump();
			}
		}).bind(this));
		return obj;
	}

	clone(){
		var multipleParam = new MultipleParam();
		var param = this.dump();
		multipleParam.init(param);
		return multipleParam;
	}
}

class MultipleSheet{
	constructor(){

	}
	init(param){
		this.sheetNames = param.sheetNames;
		this.sheets = param.sheets.map(function(sheet){
			var multipleParam = new MultipleParam();
			multipleParam.init(sheet)
			return multipleParam;
		})
	}

	clone(){
		var multipleSheet = new MultipleSheet();
		var param = this.dump();
		multipleSheet.init(param);
		return multipleSheet;
	}
	dump(){
		var obj = {};
		obj.sheetNames = this.sheetNames.map(function(sheetName){return sheetName;})
		obj.sheets = this.sheets.map(function(sheet){
			return sheet.dump();
		})
		return obj;
	}
}



class MuleMRD extends MultipleSheet{
	constructor(){
		super();
	}
} 
class IVTuning extends MultipleSheet{
	constructor(){
		super();
	}
} 
class HardTooling extends MultipleSheet{
	constructor(){
		super();
	}
} 
class PPVMrd extends MultipleSheet{
	constructor(){
		super();
	}
} 

class BenchMark extends MultipleSheet{
	constructor(){
		super();
	}	
}


exports.MuleMRD = MuleMRD;
exports.IVTuning = IVTuning;
exports.HardTooling = HardTooling;
exports.PPVMrd = PPVMrd;
exports.BenchMark = BenchMark;




