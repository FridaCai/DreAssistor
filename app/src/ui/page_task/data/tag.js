import Util from 'Util';

module.exports = class Tag {
	constructor(){
		
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.label = param.label;
		this.time=param.time;
		this.week = param.week;
		this.width = Util.TAG_WIDTH;
		this.markColor = Util.TAG_COLOR;
	}
	setParent(parent){
		this.parent = parent;
	}
	update(param){
		this._updateMeta(param);
	}
	_updateMeta(param){
		this.label = param.label;
		this.time=param.time;
		this.week = param.week;
	}
	dump(){
		return {
			id: this.id,
			label: this.label,
			time: this.time,
			week: this.week,
			width: this.width,
			markColor: this.markColor,
			comment: `time: ${new Date(this.time)}`
		}
	}
}