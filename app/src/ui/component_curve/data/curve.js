import Util from 'Util';

module.exports = class Curve {
	constructor(){

	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.parent = undefined; //todo
		
		this.caption = param.caption || '';
		this.labels = param.labels || [];
		this.series = param.series || [];//{label, data, isshow}
	}

	dump(){
		return {
			id: this.id,
			caption: this.caption,
			labels: this.labels,
			series: this.series,
		}
	}

}