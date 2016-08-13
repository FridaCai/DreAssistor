import Normal from './normal.js';
import EWO from './ewo.js';
import HotIssue from './hotissue.js';

import {MuleMRD} from './mixparam.js';
import {IVTuning} from './mixparam.js';
import {HardTooling} from './mixparam.js';
import {PPVMrd} from './mixparam.js';

//import BenchMark from './normal.js';

module.exports = class TemplateFactory{
	static create(type){
		switch(type){
			case 0:
				return new Normal();
			case 1:
				return new EWO();
			case 2:
				return new HotIssue();
			case 3:
				return new MuleMRD();
			case 4:
				return new IVTuning();
			case 5:
				return new HardTooling();
			case 6:
				return new PPVMrd();
			/*case 7:
				return new BenchMark();*/
			default:
				return new Normal();
		}
	}
}