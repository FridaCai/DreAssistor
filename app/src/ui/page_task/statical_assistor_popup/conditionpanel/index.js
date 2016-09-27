import './style.less';
import RadioGroup from 'RadioGroup';
import ComboBox from 'ComboBox';
import Input from 'Input';
import Button from 'Button';
import GlobalAPI from '../../../../api'; //bad.
import API from '../../api';

var ConditionPanel = React.createClass({
	getInitialState: function() {
		return {};
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

        var comboBoxParam = {
        	id: '',
        	options: [{id: -1, label:'全部'}].concat(API.getAllTemplateTaskTypes()),
        	prompt: '请选择'
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

    	return (
    		<div className='conditionPanel'>
    			<div className='line'>
	    			<label>项目</label>
	    			<RadioGroup param={radioGroupParam} ref='projectCreatorRadioGroup'/>
    			</div>
    			<div className='line'>
    				<label>豆豆</label>
    				<ComboBox param={comboBoxParam}  ref='taskTypeComboBox'/>
    			</div>
    			<div className='line'>
    				<label>条件</label>
    				<Input param={inputParam}  ref='searchClauseInput'/>
    				<div className="expressSearchHint">
  							eg:
  							<br/>	
  							发动机<b>=</b>1.0T
	    					<br/>
	    					成本<b>=</b><b>*</b>
	    					<br/>
	    					发动机<b>=</b>1.0T<b>&amp;</b>品牌<b>=</b>大众
							<br/><br/>
							常用关键字：<br/>发动机，成本，品牌，重量
					</div>
    			</div>
    			<div className='line'>
    				<Button param={okBtnParam}/>
    			</div>
    			
    		</div>
		)
    }
})
module.exports = ConditionPanel;