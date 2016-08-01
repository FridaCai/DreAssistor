import BaseTask from './basetask.js';
import Util from 'Util';

module.exports = class Task extends BaseTask{
	constructor(){
	    super(); 
	}
	meetCondition(condition){
		if(!condition)
			return true;
		
		return (Util.getValue(this, condition.key) === condition.value);
	}
}