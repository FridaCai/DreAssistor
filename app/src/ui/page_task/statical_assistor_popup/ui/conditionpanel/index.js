import './style.less';
import RadioGroup from 'RadioGroup';
import ComboBox from 'ComboBox';
import Input from 'Input';
import Button from 'Button';
import GlobalAPI from 'api';

var ConditionPanel = React.createClass({
	getInitialState: function() {
		return {
            showHint:false,
        };
    },

    onOK: function(){
    	var param = {};

    	var projectCreator = (function(selectedId){
        	if(selectedId === 1)
        		return GlobalAPI.getLoginUser().id; 
        	return null
    	})(this.refs.projectCreatorRadioGroup.getValue())
    	
    	if(projectCreator != undefined){
    		param.projectCreator = projectCreator;
    	}

    	var taskType = this.refs.taskTypeComboBox.getValue();
    	
    	if(taskType != undefined && taskType!=-1){
    		param.taskType = taskType;
    	}

    	var searchClause = encodeURIComponent(this.refs.searchClauseInput.getValue());
    	
    	if(searchClause){
    		param.searchClause = searchClause;
    	}

    	this.props.onOK && this.props.onOK(param);
    },
    toggleHint: function(){
        var showHint = !this.state.showHint;
        this.setState({showHint: showHint});
    },
    render: function(){

    	var radioGroupParam = {
            id: `projectFilter2`,
            selectedId: 0,
            options: [{
                id: 0,
                label:"全部项目"
            },{
                id: 1,
                label: "只看自己的项目"
            }]
        }



        var options = [{id: -1, label:'全部'}].concat(GlobalAPI.getAllTemplateTaskTypes());
        var comboBoxParam = {
            id: '',
            options: options,
            prompt: '请选择'
        }


        if(this.props.taskType != undefined){
            var taskTemplate = GlobalAPI.findTemplateByType(this.props.taskType);
            var label = taskTemplate.label;
            options = [{id: this.props.taskType, label: label}];
            comboBoxParam = {
                id: '',
                options: options,
                selectedId: this.props.taskType
            }
        }


        var inputParam = {
        	value: '',
        }
        var okBtnParam = {
        	label: '确定',
        	onClick: (function(){
        		this.onOK();
        	}).bind(this)
        }

        var showHint = this.state.showHint;
        var hintStyle = showHint ? {display: 'block'} : {display:'none'};

    	return (
    		<div className='conditionPanel'>
    			<div className='line'>
    				<label>条件</label>
    				<Input param={inputParam}  ref='searchClauseInput'/>
                    <span className='hint' onClick={this.toggleHint}>?</span>
    				<Button param={okBtnParam}/>
                    
                    <div className="expressSearchHint" style={hintStyle}  >
                            任性搜索：                     
  							<br/>
                            输入任意关键字
                            <br/><br/>
                            条件搜索：
                            <br/>
  							发动机<b>=</b>1.0T
	    					<br/>
	    					成本<b>=</b><b>*</b>
	    					<br/>
	    					发动机<b>=</b>1.0T<b>&amp;</b>品牌<b>=</b>大众
                            <br/>
							可选关键字：发动机，成本，品牌，重量
					</div>

    			</div>
    		</div>
		)
    }
})
module.exports = ConditionPanel;