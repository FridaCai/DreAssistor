module.exports = class HotIssue{
	constructor(){
	}
	init(param){
		this.rootCause = param.rootCause;
		this.solution = param.solution;
		this.execute = param.execute;
		this.feedback = param.feedback;
	}
	dump(){
		
	}
}