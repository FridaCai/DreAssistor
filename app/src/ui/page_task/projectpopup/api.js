import Signal from '../../../signal.js';
import Request from '../../../request.js';
import Task from './data/task.js';
import Tag from './data/tag.js';
import Property from './data/property.js';
import Project from '../data/project.js';
import SaveAs from 'browser-saveas';

var API = {
	project: new Project(),

	uidata: {
		property: new Property(), 
		tag: new Tag(),
		task: new Task(),
	},
	getProject: function(){
		return this.project;
	},
	setProject: function(value){
		this.project = value;
	},

	loadTemplate: function(){ 
		var url = Request.getMockupAPI('template_project.json');
        return Request.getData(url).then((function(result){
 			return result;
        }).bind(this))
	},


	ui2dm: function(){
		this.uidata.property.ui2dm(this.project);
		this.uidata.tag.ui2dm(this.project);
		this.uidata.task.ui2dm(this.project);
	},

	dm2ui: function(){
		if(!this.project){
			return;
		}

		var property = new Property();
		property.dm2ui(this.project);

		var tag = new Tag();
		tag.dm2ui(this.project);

		var task = new Task();
		task.dm2ui(this.project);

		this.uidata = {
			property: property,
			tag: tag,
			task: task,
		}
	},

	xls2ui: function(param){
		var propertySheet = param.property;
		var tagSheet = param.tag;
		var taskSheet = param.task;

		var errorCode = -1;
		var errorMsg = '';

		try{
			//overwrite data strategy for now. for multiple task sheet case, think about other strategy.
			
			propertySheet.map(function(sheet){
				var property = new Property();
				property.xls2ui(sheet.sheet);
				API.uidata.property = property;	
			})

			tagSheet.map(function(sheet){
				var tag = new Tag();			
				tag.xls2ui(sheet.sheet);
				API.uidata.tag = tag;	
			})
			
			taskSheet.map(function(sheet){
				var task = new Task();
				if(sheet.mode ==1)
					task = API.uidata.task;

				task.xls2ui(sheet.sheet);
				API.uidata.task = task;	
			})
		}catch(e){
			console.error(e);
		}

		return {
			errorCode: errorCode,
			errorMsg: errorMsg
		}
	},
	ui2xls: function(){
		var ui2excel = function(raw){
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

	        console.log(raw);
	        console.table(raw);
	        for(var key in raw){
	            var sheet = [raw[key].header].concat(raw[key].ui);
	            sheets[key] = sheet_from_array_of_arrays(sheet);
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

        var wb = ui2excel(API.uidata);
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
		var name = `excel_${Date.parse(new Date())}.xlsx`;
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), name);
	},

	//when to call? drag/import excel; close create project;
	clear:function(){
		this.project = new Project();
	},
}
window.dre.projectpopup = {
	data: API	
};
module.exports = API;

