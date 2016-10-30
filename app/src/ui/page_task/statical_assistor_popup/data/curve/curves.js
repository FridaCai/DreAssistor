module.exports = class Curves extends Array{
	static create(param){
		var curves = new Curves();
		curves.init(param);
		return curves;
	}
	constructor(){
		super();
	}
	init(param){
		
	}
	dump(){
		
	}
	clear(){
		
	}
	add(curve){
		this.push(curve);
	}
	deleteAt(index){
		this.splice(index,1);
	}
}