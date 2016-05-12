import Person from './person.js';

module.exports = class People {
	constructor(){
		this.arr = new Array();
	}

	init(peopleObj){	
		peopleObj.forEach((function(personObj) {
			var person = new Person();
			person.init(personObj);
			this.arr.push(person);
		}).bind(this));
	}

	
}