import {MultipleSheet} from './mix.js';
module.exports = class HotIssue{
	static create(param){
		var hotissue = new HotIssue();
		hotissue.init(param);
		return hotissue;
	}
	constructor(){
	}
	init(param){
		this.type = param.type;
		this.sheetNames = [""];
		this.sheets = MultipleSheet.create(param.sheets);

/*		this.rootCause = param.rootCause;
		this.solution = param.solution;
		this.execute = param.execute;
		this.feedback = param.feedback;*/
	}
	dump(){
		return {
			type: this.type,
			sheetNames: this.sheetNames,
			sheets: this.sheets.dump()
		}
	}
	clone(){
		return HotIssue.create(this.dump());
	}
}
