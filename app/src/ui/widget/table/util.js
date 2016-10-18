import {Line, ExpandLine} from 'Table';

var Util = {
	getBrotherLine: function(line, group){
		var curIndex;
		for(var i=0; i<group.length; i++){
			var l = group[i];
			if(l.id === line.id){
				curIndex = i;
				break;
			}
		}

		if(line instanceof ExpandLine){
			return group[curIndex-1];			
		}else if(line instanceof Line){
			return group[curIndex+1];
		}
	}
}
module.exports = Util;