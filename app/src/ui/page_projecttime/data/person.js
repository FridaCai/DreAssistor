module.exports = class Person {
	constructor(){
	}

	init(personObj){	
		this.id = personObj.id;
		this.name = personObj.name;
		this.role = personObj.role;
	}

	
}