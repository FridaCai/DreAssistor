import {Attachments} from '../attachments.js';
import {Images} from '../images.js';
import Curve from '../../../component_curve/data/curve.js';


exports.COMPONENT_ENUM = {
	'LABEL': 'label',
	'STATUS': 'status',
	'REFKEY': 'refKey',
	'ATTACHMENTS': 'attachments',
	'VALUE': 'value',
	'CURVE': 'curve',
	'IMAGES': 'images',
	'TEXT': 'text',
	'DROPDOWN': 'dropdown',
	'TIME': 'time',
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
	'dropdown':"选项",
	'time': "时间",
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
		this.attachments =  param.attachment ? Attachments.create(param.attachment): undefined;
		this.value = param.value;
		this.curve = param.curve ? Curve.create(param.curve) : undefined;
		this.images = param.image ? Images.create(param.image) : undefined;
		this.text = param.text;
		this.dropdown = param.dropdown;
		this.time = param.time;
		this.key = param.key;
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
			attachment: this.attachments ? this.attachments.dump() : undefined,
			value: this.value,
			curve: this.curve ? this.curve.dump(): undefined,
			image: this.images ? this.images.dump(): undefined,
			text: this.text,
			dropdown: this.dropdown,
			time: this.time,
			key: this.key,
			comment: `time: ${new Date(this.time)}`
		}
	}
}

class MultipleParam extends Array{
	static create(param){
		var multipleParam = new MultipleParam();
		multipleParam.init(param);
		return multipleParam;
	}
	constructor(){
		super();
	}
	init(param){
		param.map((function(p){
			var singleParam = SingleParam.create(p);
			super.push(singleParam);
		}).bind(this))
	}

	dump(){
		return this.map(function(singleParam){
			return singleParam.dump()
		})
	}

	clone(){
		var multipleParam = new MultipleParam();
		var param = this.dump();
		multipleParam.init(param);
		return multipleParam;
	}
}

class MultipleSheet extends Array{
	static create(param){
		var multipleSheet = new MultipleSheet();
		multipleSheet.init(param);
		return multipleSheet;
	}

	constructor(){
		super();
	}

	init(param){
		param.map((function(p){
			var multipleParam = MultipleParam.create(p);
			this.push(multipleParam);
		}).bind(this))
	}

	clone(){
		var param = this.dump();
		return MultipleParam.create(param);
	}

	dump(){
		return this.map(function(sheet){
			return sheet.dump();
		})
	}
}

class MultiSheetTemplate{
	static create(param){
		var multisheetTemplate = new MultiSheetTemplate();
		multisheetTemplate.init(param);
		return multisheetTemplate;
	}
	init(param){
		this.type = param.type;
		this.sheetNames = param.sheetNames;
		this.sheets = MultipleSheet.create(param.sheets);
	}
	constructor(){

	}
	
	dump(){
		return {
			type: this.type,
			sheetNames: this.sheetNames,
			sheets: this.sheets.dump()
		}
	}
	clone(){
		return MultiSheetTemplate.create(this.dump());
	}
}

class MuleMRD extends MultiSheetTemplate{
	constructor(){
		super();
	}
} 
class IVTuning extends MultiSheetTemplate{
	constructor(){
		super();
	}
} 
class HardTooling extends MultiSheetTemplate{
	constructor(){
		super();
	}
} 
class PPVMrd extends MultiSheetTemplate{
	constructor(){
		super();
	}
} 

class BenchMark extends MultiSheetTemplate{
	constructor(){
		super();
	}	
}


exports.MuleMRD = MuleMRD;
exports.IVTuning = IVTuning;
exports.HardTooling = HardTooling;
exports.PPVMrd = PPVMrd;
exports.BenchMark = BenchMark;



//todo: refactor. new MuleMRD, IVGuning... SingleParam and MultipleParam will be used widely.
exports.SingleParam = SingleParam;
exports.MultipleParam = MultipleParam;
exports.MultipleSheet = MultipleSheet;




