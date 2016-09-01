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
		this.id = param.id || Util.generateUUID();
		this.parent = undefined; //todo
		
		this.caption = param.caption || '';
		this.data = param.data || [];
		this.series = param.series || [];//{label, data, isShowCurve}
	}

	dump(){
		return {
			id: this.id,
			caption: this.caption,
			data: this.data,
			series: this.series,
		}
	}

}