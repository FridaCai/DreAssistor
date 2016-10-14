import Signal from 'Signal';
import Request from 'Request';
import Curve from 'data/curve.js'; 
import CurveUI from './uidata/curve.js';

//todo: template mode??? very similar with projectpopup/api
class API{
	constructor(){

	}

	init(){
		this.curve = new Curve();
		this.uidata = {
			curve: new CurveUI()
		}
		this.signal_curve_toggle = new Signal();
		this.uidata.curve.setToggleSignal(this.signal_curve_toggle);
	}
	setCurveNeedTemplate(needTemplate){
		this.curve.setNeedTemplate(needTemplate);
	}
	setCurve(curve){
		this.curve = curve;
	}
	getCurve(){
		return this.curve;
	}
	ui2dm(){
		this.uidata.curve.ui2dm(this.curve);
	}
	
	dm2ui(){
		this.uidata.curve.dm2ui(this.curve);
	}

	ui2xls(){
		this.uidata.curve.ui2xls();
	}

	xls2ui(param){
		var curveSheet = param.curve;
		var errorCode = -1;
		var errorMsg = '';

		try{
			curveSheet.map((function(sheet){
				this.uidata.curve = new CurveUI();
				this.uidata.curve.xls2ui(sheet.sheet)
				this.uidata.curve.setToggleSignal(this.signal_curve_toggle);
			}).bind(this))
		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg,
		}
	}
}
module.exports = API;