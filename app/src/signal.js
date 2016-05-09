import Util from './util.js';

class Signal{
	constructor(){
		this.key = Util.generateUUID();
		this.event = $.Event(this.key);
	}

	listen(listener) {
		$('body').bind(this.key, listener);    
	}

	unlisten(listener) {
	    $('body').unbind(this.key, listener);    
	};

	dispatch(param){
	    $('body').trigger(this.event, [param]);    
	};
}

module.exports = Signal;