import Util from 'Util';

module.exports = class Curve {
	constructor(){

	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.parent = undefined; //todo
		
		this.caption = param.caption || '';
		this.data = param.data || [];
		this.series = param.series || [];//{label, data, isshow}
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