var Util = {
 	getRange: function(raw){
	    var reg = /^([A-Z]*)(\d*)\:([A-Z]*)(\d*)$/;
	    var result = raw.match(reg);

	    return {
	      lineMin: parseInt(result[2]),
	      lineMax: parseInt(result[4]),
	      columnMin: result[1],
	      columnMax: result[3],
	    }
  	},




  	/*
		Util.alphabet2Index('A'); // 1
		Util.alphabet2Index('BC'); //2*26+3=55
		Util.alphabet2Index('CDE');//3*26^2+4*26+5=2137
		Util.index2Alphabet(1); 
		Util.index2Alphabet(55);  
		Util.index2Alphabet(2137); 
  	*/
  	alphabet2Index:function(alphabet){
  		var ans = 0;

		for(var i = 0; i < alphabet.length; i++) {
            ans = (alphabet[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1) + ans * 26;  
        }
        return ans;
  	},
  	index2Alphabet: function(index){
		var res = '';
		var n = index;
	    while(n >= 1) {
	        res = String.fromCharCode('A'.charCodeAt(0) + (n-1) % 26) + res;
	        n = (n-1) / 26;
	    }
	    return res;
  	}
}

module.exports = Util;