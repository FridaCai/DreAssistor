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
	clone(){
		var hotissue = new HotIssue();
		hotissue.init({
			rootCause: this.rootCause,
			solution: this.solution,
			execute: this.execute,
			feedback: this.feedback
		});
		return hotissue;
	}
}