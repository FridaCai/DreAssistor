import {Attachments} from './attachments.js';
import {Attachment} from './attachments.js';

exports.Images = class Images extends Attachments{
	static create(param){
		var images = new Images();
		images.init(param);
		return images;
	}
	constructor(){
		super();
	}
}

exports.Image = class Image extends Attachment{
	constructor(){
		super();
	}
}