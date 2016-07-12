import Util from '../../widget/excel/util.js';
import Request from '../../../request.js';
import moment from 'moment';
import SaveAs from 'browser-saveas';

var Table = React.createClass({
	getInitialState: function() {
		this.PROPERTY_SHEETNAME = 'property';
		this.TAGS_SHEETNAME = 'tags';
		this.sheetNames = [this.PROPERTY_SHEETNAME, this.TAGS_SHEETNAME];

        return {
        	sheetIndex: 0,
        	projectObj: undefined,
        };
    },

    getData: function(){
        return this.state.projectObj;
    },  

    onSwitchSheet: function(index){
    	this.setState({
    		sheetIndex: index,
    	})
    },	

    onDrop: function(e){
	  	e.stopPropagation();
	  	e.preventDefault();
	  	var files = e.dataTransfer.files;
		var reader = new FileReader();

		var file = files[0];
	  	var fileName = file.name;
	  	reader.onload = (function(e){
	  		var data = e.target.result;
	  		this.parseData(data);
	  	}).bind(this);
		reader.readAsBinaryString(file);
	},

	parseData: function(data){
		var PROPERTY_SHEETNAME = 'property';
        var TAGS_SHEETNAME = 'tags';

        var workbook = XLSX.read(data, {type: 'binary'});

        (function parsePropertySheet(){
            var propertysheet = workbook.Sheets[PROPERTY_SHEETNAME];
            var range = Util.getRange(propertysheet['!ref']);
            for (var i=range.lineMin+1; i<range.lineMax+1; i++){
                var property = propertysheet[`A${i}`].v;
                var value = propertysheet[`B${i}`].v;
                switch(property){
                    case 'label':
                        projectObj.label = value;
                        break;
                    case 'bpmax':
                        projectObj.bpmax = Math.round(value * 100) / 100;
                        break;
                    case 'bpmin':
                        projectObj.bpmin = Math.round(value * 100) / 100;
                        break;
                    case 'ec':
                        projectObj.ec = value;
                        break;
                }
            }
            projectObj.children = [{
                "label": "Mast Timing",
                "children": [],
            },{
                "label": "AIS Development",
                "children": [],
            }];
        })();
        


        (function parseTagsSheet(){
            //need range of column and line.
            //find lines where content in F column is not null or title ('Update Program Milestone')
            //get week(label) and time and tag label from the line.
            var columnName = 'Update Program Milestone';
            var tagsheet = workbook.Sheets[TAGS_SHEETNAME];
            var range = Util.getRange(tagsheet['!ref']);
            for(var i = range.lineMin; i<range.lineMax; i++){
                var cell = tagsheet[`C${i}`];

                if(cell && cell.v != columnName){
                    var label = cell.v;
                    var week = tagsheet[`A${i}`].v;
                    var date = parseInt(moment(tagsheet[`B${i}`].w,'MM-DD-YYYY').format('x')); //5/13/13
                    projectObj.children[0].children.push({
                        "label": label,
                        "time": date, 
                        "week": week,
                        //"width": 50, 
                        //"markColor": 255,
                        "class": "Tag",
                    })
                }
            }
        })()
        this.setState({projectObj: projectObj});
	},

	onDragOver(e){e.preventDefault();},

	componentDidMount: function(){
		this.loadTemplateData();
	},

	loadTemplateData: function(){
		if(this.state.projectObj)
			return;

		Request.getData(Request.getMockupAPI('template_project.json')).then((function(result){
			this.setState({projectObj: result});
		}).bind(this))
	},

	render:function(){
    	if(!this.state.projectObj){
    		return null;
    	}

    	var getPropertyDom = (function(){
        	var dom = [];
        	dom.push((<tr key='propertyHeader'>
        		<td>property</td>
        		<td>value</td>
    		</tr>))
        	for(var key in this.state.projectObj){
        		if(key === 'children'){
        			continue;
        		}

        		var value = this.state.projectObj[key];
        		dom.push((<tr key={key}>
        			<td>{key}</td>
        			<td>{value}</td>
        		</tr>))
        	}
        	return dom;
    	}).bind(this);

    	var getTagDom = (function(){
    		var dom = [];
    		dom.push((<tr key='tagHeader'>
    			<td>Week</td>
    			<td>DATE</td>
    			<td>Update Program Milestone</td>	
    		</tr>))

    		this.state.projectObj.children[0].children.map((function(tag){
				dom.push((<tr  key={tag.label}>
	    			<td>{tag.week}</td>
	    			<td>{new Date(tag.time).toLocaleDateString()}</td>
	    			<td>{tag.label}</td>	
	    		</tr>))
    		}).bind(this))
    		return dom;
    	}).bind(this);

        var getTableDom = (function(){
        	if(this.state.sheetIndex === 0){
        		return getPropertyDom();
        	}else if(this.state.sheetIndex === 1){
				return getTagDom();
        	}
        }).bind(this);

		return (
			<div className='panel-body projectPopup' onDragOver={this.onDragOver} onDrop={this.onDrop}>
				<div className='addOn'>
					<label>可以将excel文件拖入表格</label>
					<button className="btn btn-primary" onClick={this.export}>导出excel</button>
				</div>
	    		<div className='dataTable' >
	        		<ul className="nav nav-tabs">
	        		{
	        			this.sheetNames.map((function(sheetName, index){
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
							{getTableDom()}
							</tbody>
						</table>
	                </div>
	            </div>
            </div>
		)
	},


	//convert this.state.projectObj to excel file.
	export: function(){
		var sheet_from_array_of_arrays = function(data){
			var ws = {};
			var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
			for(var R = 0; R != data.length; ++R) {
				for(var C = 0; C != data[R].length; ++C) {
					if(range.s.r > R) range.s.r = R;
					if(range.s.c > C) range.s.c = C;
					if(range.e.r < R) range.e.r = R;
					if(range.e.c < C) range.e.c = C;
					var cell = {v: data[R][C] };
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

        var s2ab = function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        var generatePropertyData = (function(data){
            var returnValue = [['property', 'value']];
            
            for(var key in data){
                if(key === 'children'){
                    continue;
                }
                var value = data[key];
                returnValue.push([key, value]);
            }
            return returnValue;
        }).bind(this);

        var generateTagsData = (function(tags){
            var returnValue = [['Week', 'DATE', 'Update Program Milestone']];
            tags.map((function(tag){
                returnValue.push([tag.week, new Date(tag.time).toLocaleDateString(), tag.label]);
            }).bind(this));
            return returnValue;
        }).bind(this);
        
        var sheets = (function(){
            var sheets = {};
            sheets[this.PROPERTY_SHEETNAME] = sheet_from_array_of_arrays(generatePropertyData(this.state.projectObj));
            sheets[this.TAGS_SHEETNAME] = sheet_from_array_of_arrays(generateTagsData(this.state.projectObj.children[0].children));
            return sheets;
        }).call(this);

        var wb = {
            SheetNames:[
                this.PROPERTY_SHEETNAME,
                this.TAGS_SHEETNAME
            ], Sheets: sheets
        };

		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")
	},

    render_according_to_excel: function(){
    	if(!this.state.projectObj){
    		return null;
    	}


    	//not according to excel, but according to projectObj



    	var workbook = this.props.workbook;
    	if(!workbook) return null; //if create project popup as needed, rather than show/hide will not bring this issue.
    	
    	var sheet = workbook.Sheets[this.sheetNames[this.state.sheetIndex]];
        var range = Util.getRange(sheet['!ref']);

        //problem for date. cell.t='n'. oops...need to convert to timestamp.
        var getTableDom = function(sheet){
        	var dom = [];

        	for(var line = range.lineMin; line <= range.lineMax; line++){
        		var columnMinIndex = Util.alphabet2Index(range.columnMin);
        		var columnMaxIndex = Util.alphabet2Index(range.columnMax);

        		var tdArr = [];
        		for(var column = columnMinIndex; column <= columnMaxIndex; column++){
					var columnAlphabet = Util.index2Alphabet(column);

					var cell = sheet[`${columnAlphabet}${line}`];
					var value = cell ? cell.w: '';
					tdArr.push((<td key={columnAlphabet} title={value}>{value}</td>));
        		}
        		dom.push((<tr key={line.toString()}>{tdArr}</tr>));
        	}
			return dom;
        }

    	return (
    		<div className='dataTable' onDragOver={this.onDragOver} onDrop={this.onDrop}>
        		<ul className="nav nav-tabs">
        		{
        			this.sheetNames.map((function(sheetName, index){
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
						{
							getTableDom(sheet)
							
						}
						</tbody>
					</table>
                </div>
            </div>
		)
    }
})

module.exports = Table;
