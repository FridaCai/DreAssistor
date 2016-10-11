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
		this.parent = undefined; //need?

		this._updateMeta(param);
	}
	_updateMeta(param){
		this.caption = param.caption;
		this.data = param.data;
		this.series = param.series;//{label, data, isShowCurve}

		this.needTemplate = (Object.keys(param).length === 0) ? true : false;
	}

	update(param){
		this._updateMeta(param);
	}
	setNeedTemplate(needTemplate){
		this.needTemplate = needTemplate;
	}

	dump(){
		var obj = {};
		if(!this.needTemplate){
			obj = {
				id: Util.isUUID(this.id) ? undefined: this.id,
				caption: this.caption,
				data: this.data,
				series: this.series,
			}
		}
		return obj;
	}

}