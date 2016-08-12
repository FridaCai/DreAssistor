class MixParam{
	static create(param){
		var mixparam = new MixParam();
		mixparam.init(param);
		return mixparam;
	}
	constructor(){

	}
	init(param){
		this.label = param.label;
		this.status = param.status;
		this.refKey = param.refKey;
		this.attachments = param.attachments;
		this.value = param.value;
		this.curve = param.curve;
	}
}

module.exports = class MuleMRD{
	constructor(){

	}
	init(param){
		this.muleBomCheck = MixParam.create(param.muleBomCheck);
		this.sizeCheck = new MixParam.create(param.sizeCheck);
		//todo: other parameters
		//todo: other tasks ivtuning...
	}
	dump(){
		
	}
	clone(){
		
	}
}