module.exports = class Person {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.name = param.name;
		this.email = param.email;
	}
	
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}
	
	dump(){
		return {
			id: this.id,
			name: this.label,
			email: this.url,
		}
	}
}