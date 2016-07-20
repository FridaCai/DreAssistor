import MessageBox from '../../../widget/messagebox.js';
import CDropDown from '../../../widget/dropdown/dropdown.js';
import API from '../api.js';

var Popup = React.createClass({
	getInitialState: function() {
    	this.dropdownComponents =[];
    	this.options = [{
	    	id: 'property', label: '项目属性'
	    }, {
	    	id: 'tag', label:'master timing时间节点'
	    }, {
	    	id: 'task', label: '豆豆'
	    },{
	    	id: 'no', label:'无'
	    }];

        return {
            title: this.props.title,
            onOK: this.props.onOK,
            workbook: this.props.workbook,
        };
    },
	
	componentDidMount: function(){
		var loop = this.props.workbook.SheetNames.length;

		for (var i=0; i<loop; i++) {	
			var id = `dropdown_${i}`;
			var container = this.refs[id];
            var options = this.options;
            var prompt = '请选择数据类型';
            var param = {
                id: id, //string.
                defaultKey: null, 
                prompt: prompt,
                options: options,
                onchange: (function(key){
                    
                }).bind(this),
            };
            this.dropdownComponents.push(CDropDown.create(container, param));
		}
	},

	componentDidUnMount: function(){

	},

	getContent: function() {
	    return (
	    	<div className='importExcelPopup'>
	    		<div className='line'>请选择需要导入的excel及数据类型</div>
			    {
			    	this.state.workbook.SheetNames.map((function(sheetName, index){
			    		var drowpdownRef = `dropdown_${index}`;


			    		return (
			    			<div className='line' key={index}>
			    				<label>{sheetName}</label>
			    				<span ref={drowpdownRef}/>
		    				</div>
	    				)


			    	}).bind(this))
			    }
            </div>

	    )
    },

	checkExcelFile: function(sheetType){
    	var getSheets = (function(workbook, sheetType, key){
			var indices = sheetType[key];
			return indices.map(function(index){
				var sheetName = workbook.SheetNames[index];
	    		return workbook.Sheets[sheetName];
			})
    	}).bind(this, this.state.workbook, sheetType)


    	var propertySheets = getSheets('property');
    	var propertySheetCheck = API.property.checkSheet(propertySheets[0]);

    	return propertySheetCheck;
    	//similar 4 tag and task.
	},

	getUIData: function(sheetType){
		
	},


    onOK:function() {
    	var sheetType = {property: [], tag: [], task: []}; //{property: [sheetIndex, sheetIndex], tag: [sheetIndex, sheetIndex], tasks: [sheetIndex, sheetIndex]}
    	this.dropdownComponents.map((function(dropdown, index){
    		var key = dropdown.getValue();
    		if (key && key!=='no') {
				sheetType[key].push(index);
    		}  
    	}).bind(this))

		if(this.checkExcelFile(sheetType).errorCode === -1){
			var ui = this.getUIData(sheetType);
			this.state.onOK(ui);
        	return Promise.resolve();	
		}
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} onOK={this.onOK} isShow={true} ref='msgbox' cName='importExcelPopup' children={content}/>);
    },
})

module.exports = Popup;