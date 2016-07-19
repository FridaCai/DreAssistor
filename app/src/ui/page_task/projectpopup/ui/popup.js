import MessageBox from '../../../widget/messagebox.js';
import CDropDown from '../../../widget/dropdown/dropdown.js';

var Popup = React.createClass({
	getInitialState: function() {
		
    	this.dropdownComponents =[];
    	this.options = [{
	    	id: 'property', label: '项目属性'
	    }, {
	    	id: 'tag', label:'master timing时间节点'
	    }, {
	    	id: 'task', label: '豆豆'
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

	checkExcelFile: function(){
		return {
			errorCode: -1,
			errorMsg: ''
		}
	},

	getContent: function() {
	    return (
	    	<div className='importExcelPopup'>
	    		<div className='line'>请选择需要导入的excel及数据类型</div>
			    {
			    	this.state.workbook.SheetNames.map((function(sheetName, index){
			    		return (<div className='line' key={index}>
			    			<label>{sheetName} </label>
			    			<span ref={`dropdown_${index}`}>dropdown occupation</span>
		    			</div>)
			    	}).bind(this))
			    }
            </div>
	    );   
    },
    
    onOK:function() {
    	var sheetType = {property: [], tag: [], task: []}; //{property: [sheetIndex, sheetIndex], tag: [sheetIndex, sheetIndex], tasks: [sheetIndex, sheetIndex]}
    	this.dropdownComponents.map((function(dropdown, index){
    		var key = dropdown.getValue();
    		sheetType[key].push(index);
    	}).bind(this))

		if(this.checkExcelFile().errorCode === -1){
			//convert excel 2 ui datamodel and save in api.js
			this.state.onOK();
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