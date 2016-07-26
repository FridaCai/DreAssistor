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

        var ops = this.props.sheetOptions.concat([{
            id: 'no',
            label: '无',
            writeMode: [0]
        }]);
        return {
        	dropdownSelected:undefined,
        	radioSelected: 0,
        	sheetOptions: ops,
        };
	},
	componentDidMount: function(){
		var id = 'dropDown';
		var container = this.refs.dropDown;
	    var options = this.state.sheetOptions;
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

	radioGroupChange:function(optionId){
		this.setState({
			radioSelected: optionId
		})
	},

	render:function(){
		var showRadioGroup = (function(sheetOptions, selectedKey){
			if(!selectedKey)
				return false;
			var option = sheetOptions.find(function(option){
				return (option.id === selectedKey)
			})
			return (option.writeMode.length != 1)
		})(this.state.sheetOptions, this.state.dropdownSelected)

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

			sheetOptions: this.props.sheetOptions,
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
			    				<ControllerGroup ref={controllerGroupRef} sheetOptions={this.state.sheetOptions}/>
		    				</div>
	    				)
			    	}).bind(this))
			    }
            </div>
	    )
    },


    onOK:function() {
    	var result = (function(options){
    		var r = {};
    		options.map(function(option){
    			r[option.id] = r[option.id] || [];
    		})
    		return r;
    	}).call(this, this.state.sheetOptions)



    	var sheets = this.state.workbook.Sheets;
    	var sheetNames = this.state.workbook.SheetNames;    	
		for(var i=0; i<sheetNames.length; i++){
			var {dropdownSelected, radioSelected} = this.refs[`controllerGroup_${i}`].getValue();
			if(dropdownSelected && dropdownSelected!='no'){
    			var sn = sheetNames[i];
    			var s = sheets[sn];
    			result[dropdownSelected].push({sheetName: sn, sheet: s, mode: radioSelected})
    		}
		}

		

		var checkResult = this.props.tryXls2ui(result);
		if(checkResult.errorCode === -1){
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