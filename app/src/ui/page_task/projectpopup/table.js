import Util from '../../widget/excel/util.js';
import Request from '../../../request.js';
import moment from 'moment';
import SaveAs from 'browser-saveas';
import Project from '../data/project.js';
import SuperAPI from '../../../api.js';

var Table = React.createClass({
	getInitialState: function() {
		this.PROPERTY_SHEETNAME = 'auto_property';
		this.TAGS_SHEETNAME = 'auto_tags';
        this.TASKS_SHEETNAME='auto_tasks';

        var project = this.props.project;
        var ui = this.datamodel2ui(project);
        return {
        	sheetIndex: 0,
        	ui: ui,
        };
    },

    ui2datamodel: function(ui){
        var project = new Project();
        var creator = SuperAPI.getLoginUser();
        var projectObj = {
            creatorId: creator.id,
            children: [{
                "id": 0,
                "label": "Master Timing",
                "children": []
            },{
                "id": 1,
                "label": "AIS Development",
                "children": []
            }]
        };

        //property sheet
        var propertyRaw = ui.sheets[this.PROPERTY_SHEETNAME];
        for(var i=1; i<propertyRaw.length; i++){
            var line = propertyRaw[i];
            var key = line[0].v;
            var value = line[1].v;

            switch(key){
                case 'label':
                case 'ec':
                    projectObj[key] = value;
                    break;
                case 'bpmax':
                case 'bpmin':
                    projectObj[key] = Math.round(parseFloat(value) * 100) / 100;
                    break;
                case 'sorp':
                    projectObj.sorp = Util.convertYYYYMMDD2UnixTime(value);
            }
        }

   

        //tag sheet
        var tagRaw = ui.sheets[this.TAGS_SHEETNAME];
        for(var i=1; i<tagRaw.length; i++){
            var line = tagRaw[i];

            var label = line[3].v;
            if(!label)
                continue;

            var week = parseInt(line[0].v);
            var autoTime = this.getTimeBySorpWeek(projectObj.sorp, week);
            var adjustTime = line[2].v;
            var time = adjustTime ? Util.convertYYYYMMDD2UnixTime(adjustTime): autoTime;

            projectObj.children[0].children.push({
                "label": label,
                "time": time, 
                "week": week,
                "class": "Tag",
            })
        }



        //task sheet
        var taskSheetNames = [];
        var sheetNamesRaw = ui.sheets[this.TASKS_SHEETNAME];
        for(var i=0; i<sheetNamesRaw.length; i++){
            var sheetNameRaw = sheetNamesRaw[i][0].v;
            var reg = /\$\{(.*)\}/;
            var name = sheetNameRaw.match(reg)[1];
            taskSheetNames.push(name);
        }
        taskSheetNames.map(function(name){
            var taskObj = {};
            var sheet = ui.sheets[name];
            for(var i = 1; i<sheet.length; i++){
                var key = sheet[i][0].v;
                var value = sheet[i][1].v;

                switch(key){
                    case 'label':
                    case 'desc':
                        taskObj[key] = value;
                        break;
                    case 'startTime':
                    case 'endTime':
                        taskObj[key] = Util.convertYYYYMMDD2UnixTime(value);
                        break;
                    case 'template':
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['type'] = parseInt(value);
                        break;
                    case 'snorkelNoiseXls':
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                        taskObj['template']['param']['snorkelNoiseXls'] = [value]; 
                        break;
                    case 'rootCause': 
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                        taskObj['template']['param']['rootCause'] = value; 
                        break;
                    case 'solution': 
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                        taskObj['template']['param']['solution'] = value; 
                        break;
                    case 'execute': 
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                        taskObj['template']['param']['execute'] = value; 
                        break;
                    case 'feedback': 
                        taskObj['template'] = taskObj['template'] || {};
                        taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                        taskObj['template']['param']['feedback'] = value; 
                        break;
                }
            }

            taskObj["class"] = "Task";
            taskObj["creatorId"] = creator.id;

            projectObj.children[1].children.push(taskObj);
        })

        project.init(projectObj);
        return project;
    },
    getTimeBySorpWeek: function(sorp, week){
        var substract = moment(sorp, 'x').subtract(week, 'weeks');
        var ux = substract.valueOf();
        return ux;
    },
    datamodel2ui: function(project){
        if(!project)
            return undefined;
        
        var sheetNames = [this.PROPERTY_SHEETNAME, this.TAGS_SHEETNAME, this.TASKS_SHEETNAME];
        var sheets = {};

        //property sheet.
        sheets[this.PROPERTY_SHEETNAME] = [
            [{v: 'property'}, {v:'value'}],
            [{v: 'label'}, {v: project['label']}],
            [{v: 'bpmax'}, {v: project['bpmax']}],
            [{v: 'bpmin'}, {v: project['bpmin']}],
            [{v: 'ec'}, {v: project['ec']}],
            [{v: 'sorp'}, {v:Util.convertUnixTime2YYYYMMDD(project['sorp']), isEditable:true}],
        ];


        //tags sheet.
        sheets[this.TAGS_SHEETNAME] = [[{v: 'Week'}, {v: 'Date(Sorp-Week)'}, {v:'Date(Adjusted)'}, {v:'Update Program Milestone'}]];
        //precondition: tags are desc order.
        var tags = project.children[0].children;
        var loop = tags[0].week;
        var findTagByWeek = function(tags, week){
            return tags.find(function(tag){
                return tag.week === week;
            })
        }
  
        for(var i=loop; i>=0; i--){
            var tag = findTagByWeek(tags, i);
            var autoTime = Util.convertUnixTime2YYYYMMDD(this.getTimeBySorpWeek(project.sorp, i));
            
            var tagui = [{v: i}, {v:autoTime}, {v:'', isEditable:true}, {v:''}];
            if(tag){
                tagui = [
                    {v: tag.week}, 
                    {v: autoTime}, 
                    {v: Util.convertUnixTime2YYYYMMDD(tag.time), isEditable:true}, 
                    {v: tag.label}
                ];
            }
            sheets[this.TAGS_SHEETNAME].push(tagui);
        }

        //tasks catalog sheet.
        var tasks = project.findTasks();
        sheets[this.TASKS_SHEETNAME] = [];
        tasks.map((function(task, index){
            sheets[this.TASKS_SHEETNAME].push([{v: `\$\{auto_task_${index}\}`}]);
        }).bind(this))


        //for auto_tasks, auto_task_0, auto_task_1...
        for(var i=0; i<tasks.length; i++){
            var task = tasks[i];

            var sheetName = `auto_task_${i}`;
            sheetNames.push(sheetName);
            sheets[sheetName] = [
                [{v: 'property'}, {v: 'value'}],
                [{v: 'label'}, {v: task['label']}],
                [{v: 'startTime'}, {v: Util.convertUnixTime2YYYYMMDD(task['startTime'])}],
                [{v: 'endTime'}, {v: Util.convertUnixTime2YYYYMMDD(task['endTime'])}],
                [{v: 'desc'}, {v: task['desc']}],
                [{v: 'template'}, {v: task['template']['type']}],
            ];


            var TASK_TEMPLATE = {
                NORMAL: 0,
                EWO: 1,
                HOTISSUE: 2,
                MULE: 3
            }
            switch(task['template']['type']){
                case TASK_TEMPLATE.MULE:
                    sheets[sheetName].push([{v: 'snorkelNoiseXls'}, {v: '${auto_snorkelNoiseXls}'}]);//todo: append snorkel noise sheet.
                    break;
                case TASK_TEMPLATE.HOTISSUE: 
                    sheets[sheetName].push([{v: 'rootCause'}, {v: task['template']['param']['rootCause']}]);
                    sheets[sheetName].push([{v: 'solution'}, {v: task['template']['param']['solution']}]);
                    sheets[sheetName].push([{v: 'execute'}, {v: task['template']['param']['execute']}]);
                    sheets[sheetName].push([{v: 'feedback'}, {v: task['template']['param']['feedback']}]);
                    break;
                case TASK_TEMPLATE.EWO:
                case TASK_TEMPLATE.NORMAL:
                    break;
            }
        }
        return {sheetNames: sheetNames, sheets: sheets}
    },

    //might have problem for time. 
    excel2ui: function(workbook){
        var sheetNames = [];
        var sheets = {};

        var isDate = function(value){
            if(!value || value.t != 'n')
                return false;
            var m = moment(value.w, 'MM-DD-YYYY');
            return m.isValid();
        }

        for(var sheetName in workbook.Sheets){
            sheetNames.push(sheetName);

            var sheet = workbook.Sheets[sheetName];
            var range = Util.getRange(sheet['!ref']); 
            sheets[sheetName] = [];

            for(var i=range.lineMin; i<=range.lineMax; i++){
                var columnMin = Util.alphabet2Index(range.columnMin);
                var columnMax = Util.alphabet2Index(range.columnMax);
                
                sheets[sheetName][i-1] = [];
                for(var j=columnMin; j<=columnMax; j++){
                    var key = `${Util.index2Alphabet(j)}${i}`;
                    var value = sheet[key] ? sheet[key].v : '';
                    if(isDate(sheet[key])){
                        value = sheet[key].w;
                    }
                    sheets[sheetName][i-1].push({v: value});
                }
            }
        }
        return {sheetNames: sheetNames, sheets: sheets};
    },

    ui2excel: function(ui){
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
        for(var key in ui.sheets){
            var sheet = ui.sheets[key];
            sheets[key] = sheet_from_array_of_arrays(sheet);
        }


        var workbook = {
            SheetNames: ui.sheetNames,
            Sheets: sheets,
        }

        return workbook;
    },


    getData: function(){
        return this.ui2datamodel(this.state.ui);
    },  

    onSwitchSheet: function(index){
    	this.setState({
    		sheetIndex: index,
    	})
    },	

    onDrop: function(e){
        if(this.isEdit())
            return;
        
	  	e.stopPropagation();
	  	e.preventDefault();
	  	var files = e.dataTransfer.files;
		var reader = new FileReader();

		var file = files[0];
	  	var fileName = file.name;
	  	reader.onload = (function(e){
	  		var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});


            //deal with sorp_week in dm.
            var tempUI = this.excel2ui(workbook);
            var dm = this.ui2datamodel(tempUI);
            var ui = this.datamodel2ui(dm) 
            
            this.setState({
                ui: ui
            })
	  	}).bind(this);
		reader.readAsBinaryString(file);
	},

	onDragOver(e){e.preventDefault();},

	componentDidMount: function(){
		this.loadTemplateData();
	},

	loadTemplateData: function(){
		if(this.state.ui)
			return;
		Request.getData(Request.getMockupAPI('template_project.json')).then((function(result){
            var project = new Project();
            project.init(result);
			this.setState({ui: this.datamodel2ui(project)});
		}).bind(this))
	},

    onChange: function(cell, event){
        var inputValue = event.target.value;
        cell.v = inputValue;
    },
    onBlur: function(){
        var dm = this.ui2datamodel(this.state.ui);
        var ui = this.datamodel2ui(dm);
        this.setState({ui: ui});
    },
    isEdit: function(){
        if(this.props.project)
            return true;
        return false;
    },
	render:function(){
    	if(!this.state.ui){
    		return null;
    	}
     
        var getSheetDom = (function(){
            var sheetName = this.state.ui.sheetNames[this.state.sheetIndex];
            var sheet = this.state.ui.sheets[sheetName];

            var dom = [];
            sheet.map((function(line, i){
                var tr = [];

                line.map((function(cell, j){
                    var dom = cell.isEditable ? (
                        <input defaultValue={cell.v} type='text' onChange={this.onChange.bind(this, cell)} onBlur={this.onBlur}/>
                    ) : (<span>{cell.v}</span>);


                    tr.push((
                        <td key={j}>{dom}</td>
                    ));
                }).bind(this))

                dom.push((
                    <tr key={i}>{tr}</tr>
                ));
            }).bind(this))
            return dom;
        }).bind(this);


        var getAddOn = (function(){
            if(this.isEdit()){
               return null 
            }

            return (
                <div className='addOn'>
                    <button className="btn btn-primary" onClick={this.import}>导入excel</button> 
                    <button className="btn btn-primary" onClick={this.export}>导出excel</button>
                </div>
            )

        }).bind(this);
		return (
			<div className='panel-body projectPopup' onDragOver={this.onDragOver} onDrop={this.onDrop}>
            {
                getAddOn()
            }
				
	    		<div className='dataTable' >
	        		<ul className="nav nav-tabs">
	        		{
	        			this.state.ui.sheetNames.map((function(sheetName, index){
	        				var className = (index === this.state.sheetIndex ? 'active': '');
	        				return (
			            		<li role="presentation" className={className} key={index.toString()} onClick={this.onSwitchSheet.bind(this, index)}>
			                    	<a href="javascript:void(0);">{sheetName}</a>
			                	</li>
	    					)
	        			}).bind(this))
	        		}
	            	</ul>

	            	<div className='sheet'>
						<table>
							<tbody>
							{getSheetDom()}
							</tbody>
						</table>
	                </div>
	            </div>
            </div>
		)
	},

    import: function(){
        //todo
    },
	//convert this.state.projectObj to excel file.
	export: function(){
        var s2ab = function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        var wb = this.ui2excel(this.state.ui);
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")
	}
})

module.exports = Table;
