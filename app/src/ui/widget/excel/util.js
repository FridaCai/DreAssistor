import moment from 'moment';
import {Cell} from 'Table';
import {Line} from 'Table';
import Label from 'Label';

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

    ui2excel: function(uidata){
        var ui2excel = function(raw){
            var sheet_from_array_of_arrays = function(data){
                var ws = {};
                var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                for(var R = 0; R != data.length; ++R) {
                    for(var C = 0; C != data[R].cells.length; ++C) {
                        if(range.s.r > R) range.s.r = R;
                        if(range.s.c > C) range.s.c = C;
                        if(range.e.r < R) range.e.r = R;
                        if(range.e.c < C) range.e.c = C;

                        var cell = {v: data[R].cells[C].v };


                        if(cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
                        
                        if(typeof cell.v === 'number') cell.t = 'n';
                        else if(typeof cell.v === 'boolean') cell.t = 'b';
                        else if(cell.v instanceof Date) {
                            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        
                        ws[cell_ref] = cell;
                    }
                }
                if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }
            var sheets = {};
            var sheetNames = [];

            for(var key in raw){
                //var sheet = (raw[key].appendLines).concat([raw[key].header]).concat(raw[key].ui);
                var ui = raw[key];
                sheets[key] = sheet_from_array_of_arrays(ui.dumplines4xls());
                sheetNames.push(key);
            }

            var workbook = {
                SheetNames: sheetNames,
                Sheets: sheets,
            }

            return workbook;
        }
        var s2ab = function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        var wb = ui2excel(uidata);
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
        var name = `excel_${Date.parse(new Date())}.xlsx`;
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), name);
    },
	excel2ui: function(sheet){
        var ui = [];

        var isDate = function(value){
            if(!value)
                return false;
            var m = moment(value.w, ['YYYY/M/D', 'M/D/YY'], true);
            return m.isValid();
        }

        var range = this.getRange(sheet['!ref']); 

        for (var i=range.lineMin; i<=range.lineMax; i++) {
            var columnMin = this.alphabet2Index(range.columnMin);
            var columnMax = this.alphabet2Index(range.columnMax);

            var cells = [];
            for(var j=columnMin; j<=columnMax; j++){
                var key = `${this.index2Alphabet(j)}${i}`;
                var value = sheet[key] ? sheet[key].v : '';
                if(isDate(sheet[key])){
                    value = sheet[key].w;
                }
                cells.push(Cell.create({component:Label, v: value}));
            }
            ui[i-1] = Line.create({cells: cells});
        }
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
module.exports = Util;
