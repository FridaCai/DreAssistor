import {Util} from '../../../widget/excel/util.js';
import moment from 'moment';
import SaveAs from 'browser-saveas';
import API from '../api.js';

var XlsIExport = React.createClass({
    ui2excel: function(){
        var sheet_from_array_of_arrays = function(data){
            var ws = {};
            var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            for(var R = 0; R != data.length; ++R) {
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[R][C].v };
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
        
        var raw = API.uidata;
        for(var key in raw){
            var sheet = raw[key].ui;
            sheets[key] = sheet_from_array_of_arrays(sheet);
            sheetNames.push(key);
        }


        var workbook = {
            SheetNames: sheetNames,
            Sheets: sheets,
        }

        return workbook;
    },

    onXlsUpload: function(e){
      var files = e.target.files;
      var i,f;
      for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = (function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});


            API.signal_popup_show.dispatch({workbook: workbook});

            //popup.
            //check excel valid.
            //send sigal and send ui data.

            /*var tempUI = this.excel2ui(workbook);
            var dm = this.ui2datamodel(tempUI);
            var ui = this.datamodel2ui(dm) 
            this.setState({
                ui: ui
            }, this.updateAfterRender)*/


        }).bind(this);
        reader.readAsBinaryString(f);
      }
    },

    import: function(){
        this.refs.xlsFileUploadInput.click();
    },

	export: function(){
        var s2ab = function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        var wb = this.ui2excel();
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")
	},

	_acceptedformat: ['.csv', 
		'application/vnd.ms-excel', 
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	].join(','),

    onFileInputClk: function(){
        this.refs.xlsFileUploadInput.value = null;  
    },
    
	render: function(){
		return (
            <div className='addOn'>
                <button className="btn btn-primary" onClick={this.import}>导入excel</button> 
                <button className="btn btn-primary" onClick={this.export}>导出excel</button>
                <input type="file" ref='xlsFileUploadInput'  accept={this._acceptedformat} style={{display: 'none'}} 
                	onChange={this.onXlsUpload} onClick={this.onFileInputClk}/>
            </div>
        )
	}
})
module.exports = XlsIExport;
