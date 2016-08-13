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

class MixParamTemplate{
	constructor(){

	}
	init(param){
		Object.keys(param).map((function(key){
			var value = param[key];
			this[key] = new MixParam.create(value);
		}).bind(this));

		/*this.muleBomCheck = new MixParam.create(param.muleBomCheck);
		this.sizeCheck = new MixParam.create(param.sizeCheck);
		this.bp = new MixParam.create(param.bp);
		this.transmissionLose = new MixParam.create(param.transmissionLose);
		this.mass = new MixParam.create(param.mass);
		this.maf = new MixParam.create(param.maf);
		this.sil = new MixParam.create(param.sil);
		this.docCheck = new MixParam.create(param.docCheck);*/
	}
	dump(){
		var obj = {};
		Object.keys(this).map((function(key){
			var value = this[key];
			if(value instanceof MixParam){
				obj[key] = value.dump();
			}
		}).bind(this));
		return obj;
/*
		return {
			muleBomCheck: this.muleBomCheck.dump(),
			sizeCheck: this.sizeCheck.dump(),
			bp: this.bp.dump(),
			transmissionLose: this.transmissionLose.dump(),
			mass: this.mass.dump(),
			maf: this.maf.dump(),
			sil: this.sil.dump(),
			docCheck: this.docCheck.dump(),

		}*/
	}
	clone(){
		var mixParamTemplate = new MixParamTemplate();

		var param = this.dump();
		mixParamTemplate.init(param);

		return mixParamTemplate;
	}
}




class MuleMRD extends MixParamTemplate{
	constructor(){
		super();
	}
} 
class IVTuning extends MixParamTemplate{
	constructor(){
		super();
	}
} 
class HardTooling extends MixParamTemplate{
	constructor(){
		super();
	}
} 
class PPVMrd extends MixParamTemplate{
	constructor(){
		super();
	}
} 


exports.MuleMRD = MuleMRD;
exports.IVTuning = IVTuning;
exports.HardTooling = HardTooling;
exports.PPVMrd = PPVMrd;




