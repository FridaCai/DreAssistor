import {Attachments} from './attachments.js';
import {Attachment} from './attachments.js';

module.exports = class Images extends Attachments{
	static create(param){
		var images = new Images();
		images.init(param);
		return images;
	}
	constructor(){
		super();
	}
}

class Image extends Attachment{
	constructor(){
		super();
	}
}