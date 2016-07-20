import Signal from '../../../signal.js';
import Tags from './data/tags.js';
import Tasks from './data/tasks.js';
import Property from './data/property.js';

var API = {

	signal_popup_show: new Signal(),

	property: new Property(),
	tags: new Tags(),
	tasks: new Tasks()
}

module.exports = API;

