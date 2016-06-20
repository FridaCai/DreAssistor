module.exports = class Tag {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.time=param.time;
		this.width = param.width;
		this.markColor = param.markColor;
		this.type = 'tag';
	}

	dump(){
		return {
			id: this.id,
			label: this.label,
			time: this.time,
			width: this.width,
			markColor: this.markColor,
			type: 'tag',
		}
	}
}