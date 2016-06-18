module.exports = class Tag {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.time=param.time;
		this.width = param.width;
		this.markColor = param.markColor;
	}
}