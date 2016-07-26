import Signal from '../../signal.js';
import Request from '../../request.js';
import Curve from './data/curve.js'; //todo: datamodel should be all together.
import CurveUI from './uidata/curve.js';

//todo: template mode??? very similar with projectpopup/api
var API = {
	signal_popup_show: new Signal(), 
	signal_curve_toggle: new Signal(),

	curveui: new CurveUI(),
	curve: new Curve(),

	setCurve: function(curve){
		this.curve = curve;
	},
	getCurve: function(){
		return this.curve;
	},
	loadTemplate:function(){
		var url = Request.getMockupAPI('template_curve.json');
        return Request.getData(url).then((function(result){
 			return result;
        }).bind(this))
	},
	ui2dm: function(){
		this.curveui.ui2dm(this.curve);
	}, 
	dm2ui:function(){
		this.curveui.dm2ui(this.curve);
	},

	tryXls2ui:function(param){
		//todo.
		var curveSheet = param.curve;

		var errorCode = -1;
		var errorMsg = '';



		try{
			curveSheet.map((function(sheet){
				this.curveui = new CurveUI();
				this.curveui.xls2ui(sheet.sheet)
			}).bind(this))
		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg,
		}
	},
	clear:function(){
		this.curve = new Curve();
	},
}
window.dre.curve = {
	data: API	
};
module.exports = API;