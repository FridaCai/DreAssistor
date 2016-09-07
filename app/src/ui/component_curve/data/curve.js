import Util from 'Util';

module.exports = class Curve {
	static create(param){
		var curve = new Curve();
		curve.init(param);
		return curve;
	}

	constructor(){

	}

	init(param){
		if(!param)
			return;

		this.id = param.id || Util.generateUUID();
		this.parent = undefined; //todo
		
		this.caption = param.caption || '';
		this.data = param.data;
		this.series = param.series;//{label, data, isShowCurve}

		this.needTemplate = param.series ? false : true;
	}
	setNeedTemplate(needTemplate){
		this.needTemplate = needTemplate;
	}

	dump(){
		var obj = {};
		if(!this.needTemplate){
			obj = {
				id: this.id,
				caption: this.caption,
				data: this.data,
				series: this.series,
			}
		}
		return obj;
	}

}