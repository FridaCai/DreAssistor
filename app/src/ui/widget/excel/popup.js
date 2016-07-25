import MessageBox from '../messagebox.js';
import CDropDown from '../dropdown/dropdown.js';
import RadioGroup from '../radiogroup/index.js';
import Util from '../../../util.js';

var ControllerGroup = React.createClass({
	getInitialState: function(){
		this.radioGroupOptions = {
            id: `datamode_radiogroup_${Util.generateUUID()}`,
            selectedId: 0,
            options: [{
                id: 0,
                label:"替换"
            },{
                id: 1,
                label: "添加"
            }],
            onChange: (function(selectedId){
				this.setState({radioSelected: selectedId})
            }).bind(this),
        }

        return {
        	dropdownSelected:undefined,
        	radioSelected: 0
        };
	},
	componentDidMount: function(){
		var id = 'dropDown';
		var container = this.refs.dropDown;
	    var options = [{
	    	id: 'property', label: '项目属性'
	    }, {
	    	id: 'tag', label:'master timing时间节点'
	    }, {
	    	id: 'task', label: '豆豆'
	    },{
	    	id: 'no', label:'不导入'
	    }];

	    var prompt = '请选择数据类型';
	    var param = {
	        id: id, //string.
	        defaultKey: null, 
	        prompt: prompt,
	        options: options,
	        onchange: (function(key){
	            this.setState({dropdownSelected: key});
	        }).bind(this),
	    };

	    CDropDown.create(container, param);
	},

	getValue:function(){
		return this.state;
	},
	componentDidUnMount: function(){
	},
	radioGroupChange:function(optionId){
		this.setState({
			radioSelected: optionId
		})
	},

	render:function(){
		var showRadioGroup = (this.state.dropdownSelected === 'task' ? true: false);
		var dom = showRadioGroup ? (
			<RadioGroup style={{float:'left', marginLeft:20}} 
				param={this.radioGroupOptions} 
				ref='radioGroup' />
		): null;

		return (
			<div className='controllerGroup' style={{float:'left'}}>
				<span ref='dropDown' className='dropdown'/>
				{dom}
			</div>		
		)
	}
})


var Popup = React.createClass({
	getInitialState: function() {
    	return {
            title: this.props.title,
            onOK: this.props.onOK,
            workbook: this.props.workbook,
        };
    },

	getContent: function() {
	    return (
	    	<div className='importExcelPopup'>
	    		<div className='line' style={{margin: '20px 0 10px 0'}}>请选择需要导入的sheet及数据类型</div>
			    {
			    	this.state.workbook.SheetNames.map((function(sheetName, index){
			    		var controllerGroupRef = `controllerGroup_${index}`;
			    		return (
			    			<div className='line' key={index}>
			    				<label>{sheetName}</label>
			    				<ControllerGroup ref={controllerGroupRef}/>
		    				</div>
	    				)
			    	}).bind(this))
			    }
            </div>
	    )
    },

	checkXlsFile: function(sheetType, datamode){
    	var getSheets = (function(workbook, indices){
			return indices.map(function(index){
				var sheetName = workbook.SheetNames[index];
				var sheet = workbook.Sheets[sheetName];
				return {
					sheetName: sheetName,
					sheet: sheet
				}
			})
    	}).bind(this, this.state.workbook)

    	var propertySheet = getSheets(sheetType['property'])[0]; 
    	var tagSheet = getSheets(sheetType['tag'])[0];
    	var taskSheets = getSheets(sheetType['task']);

    	var checkResult = this.props.tryXls2ui({
    		propertySheet: propertySheet,
    		tagSheet: tagSheet,
    		taskSheets: taskSheets
    	}, datamode);

    	return checkResult;
    	//similar 4 tag and task.
	},

    onOK:function() {
    	var sheetType = {property: [], tag: [], task: []}; //{property: [sheetIndex, sheetIndex], tag: [sheetIndex, sheetIndex], tasks: [sheetIndex, sheetIndex]}
    	var datamode = {property: 0, tag: 0, task:0};

    	var loop = this.state.workbook.SheetNames.length;
    	for(var i=0; i<loop; i++){
    		var {dropdownSelected, radioSelected} = this.refs[`controllerGroup_${i}`].getValue();
    		if(dropdownSelected && dropdownSelected!='no'){
    			sheetType[dropdownSelected].push(i);
    			datamode[dropdownSelected] = radioSelected;
    		}
    	}

		if(this.checkXlsFile(sheetType, datamode).errorCode === -1){
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