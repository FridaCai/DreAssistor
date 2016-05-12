import Person from './ui/page_projecttime/data/person.js'; //todo: Person should not be the data model of page_projecttime;
var API = {


	PAGE_NAMES: {
		PROJECT_TIME: 'PROJECT_TIME',
		PROJECT_ASSET: 'PROJECT_ASSET',
		PROJECT_PRO_MGR: 'PROJECT_PRO_MGR',
	},
	pageName: 'PROJECT_TIME',



	getLoginUser: function() {
		var person = new Person();
		var param = {
			"id": "1",
			"name": "刘湃",
			"role": "1",
		}
		person.init(param)
		return person;
	}

}


module.exports = API;