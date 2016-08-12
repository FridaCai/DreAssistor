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
		this.attachments = [];//Attachments.create(param.attachments);
		this.value = param.value;
		this.curve = param.curve; //param.curve;
	}
	clone(){
		var mixparam = new MixParam();
		mixparam.init({
			label: this.label,
			status: this.status,
			refKey: this.refKey,
			attachments: this.attachements,
			value: this.value,
			curve: this.curve,
		})
		return mixparam;
	}
	dump(){
		return {
			label: this.label,
			status: this.status,
			refKey: this.refKey,
			attachments: this.attachements,
			value: this.value,
			curve: this.curve,
		}
	}
}




module.exports = class MuleMRD{
	constructor(){

	}
	init(param){
		this.muleBomCheck = new MixParam.create(param.muleBomCheck);
		this.sizeCheck = new MixParam.create(param.sizeCheck);
		//todo: other parameters
		//todo: other tasks ivtuning...
	}
	dump(){
		return {
			muleBomCheck: this.muleBomCheck.dump(),
			sizeCheck: this.sizeCheck.dump()		
		}
	}
	clone(){
		var mulemrd = new MuleMRD();
		mulemrd.init({
			muleBomCheck: this.muleBomCheck.clone(),
			sizeCheck: this.sizeCheck.clone(),
		});
		return mulemrd;
	}
}