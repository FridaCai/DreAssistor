import Attachments from '../attachments.js';

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
		this.attachments = Attachments.create(param.attachments);
		this.value = param.value;
		this.curve = param.curve; //param.curve;
	}
	clone(){
		var mixparam = new MixParam();
		mixparam.init({
			label: this.label,
			status: this.status,
			refKey: this.refKey,
			attachments: this.attachments,
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
			attachments: this.attachments,
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
		this.bp = new MixParam.create(param.bp);
		this.transmissionLose = new MixParam.create(param.transmissionLose);
		this.mass = new MixParam.create(param.mass);
		this.maf = new MixParam.create(param.maf);
		this.sil = new MixParam.create(param.sil);
		this.docCheck = new MixParam.create(param.docCheck);
	}
	dump(){
		return {
			muleBomCheck: this.muleBomCheck.dump(),
			sizeCheck: this.sizeCheck.dump(),
			bp: this.bp.dump(),
			transmissionLose: this.transmissionLose.dump(),
			mass: this.mass.dump(),
			maf: this.maf.dump(),
			sil: this.sil.dump(),
			docCheck: this.docCheck.dump(),

		}
	}
	clone(){
		var mulemrd = new MuleMRD();
		mulemrd.init({
			muleBomCheck: this.muleBomCheck.clone(),
			sizeCheck: this.sizeCheck.clone(),
			bp: this.bp.clone(),
			transmissionLose: this.transmissionLose.clone(),
			mass: this.mass.clone(),
			maf: this.maf.clone(),
			sil: this.sil.clone(),
			docCheck: this.docCheck.clone(),
		});
		return mulemrd;
	}
}