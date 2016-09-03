import Normal from './normal.js';
import EWO from './ewo.js';
import HotIssue from './hotissue.js';


import {MuleMRD} from './mix.js';
import {IVTuning} from './mix.js';
import {HardTooling} from './mix.js';
import {PPVMrd} from './mix.js';
import {BenchMark} from './mix.js';

module.exports = class TemplateFactory{
	static create(templateParam){
		var template;
		switch(templateParam.type){
			case 0:
				template = new Normal();
				break;
			case 1:
				template = new EWO();
				break;
			case 2:
				template = new HotIssue();
				break;
			case 3:
				template = new MuleMRD();
				break;
			case 4:
				template = new IVTuning();
				break;
			case 5:
				template = new HardTooling();
				break;
			case 6:
				template = new PPVMrd();
				break;
			case 7:
				template = new BenchMark();
				break;
			default:
				template = new Normal();
				break;
		}
		
		template.init(templateParam);
		return template;
	}
}