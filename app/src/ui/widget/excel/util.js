import moment from 'moment';

class Cell {
    static create(param){
        var cell = new Cell();
        cell.init(param);
        return cell;
    }

	constructor(){
	   
	}

	init(param){
		this.id = param.id || undefined;
		this.v = param.v;
		this.isEditable = param.isEditable || false;
        this.isHide = param.isHide || false;
	}
    dump(){
        return {
            v: this.v,
        }
    }
}
exports.Cell = Cell;


exports.Util = {
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
  	},

  	//5/13/13; 2013/8/29
	convertYYYYMMDD2UnixTime: function(yyyyddmm){
		return parseInt(moment(yyyyddmm, ['YYYY/M/D', 'M/D/YY'], true).format('x'));
	},

	convertUnixTime2YYYYMMDD: function(unixtime){
        if(!unixtime)
            return '';
		return new Date(unixtime).toLocaleDateString();
	},

    ui2excel: function(){

    },
	excel2ui: function(sheet){
        var ui = [];

        var isDate = function(value){
            if(!value)
                return false;
            var m = moment(value.w, 'MM-DD-YYYY');
            return m.isValid();
        }

        var range = this.getRange(sheet['!ref']); 

        for (var i=range.lineMin; i<=range.lineMax; i++) {
            var columnMin = this.alphabet2Index(range.columnMin);
            var columnMax = this.alphabet2Index(range.columnMax);
            
            ui[i-1] = [];
            for(var j=columnMin; j<=columnMax; j++){
                var key = `${this.index2Alphabet(j)}${i}`;
                var value = sheet[key] ? sheet[key].v : '';
                if(isDate(sheet[key])){
                    value = sheet[key].w;
                }
                var cell = new Cell();
                cell.init({v: value});
                ui[i-1].push(cell);
            }
        }
		console.table(ui);
        return ui;
    },
    getSheetName: function(name){
        if(!name)
            return undefined;

        var reg = /\$\{(.*)\}/;
        var match = name.match(reg);
        if(match.length != 2)
            return undefined;

        return match[1];
    },  
    getTimeBySorpWeek: function(sorp, week){
        var substract = moment(sorp, 'x').subtract(week, 'weeks');
        var ux = substract.valueOf();
        return ux;
    },
}

