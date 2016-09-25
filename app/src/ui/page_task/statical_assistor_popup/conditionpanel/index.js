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
    	var projectOwner = (function(selectedId){
        	if(selectedId === 1)
        		return GlobalAPI.getLoginUser().id; 
        	return null
    	})(this.refs.projectOwnerRadioGroup.getValue())

    	var taskType = this.refs.taskTypeComboBox.getValue();

    	var searchExpress = this.refs.searchExpressInput.getValue();


    	this.props.onOK && this.props.onOK({
    		projectOwner: projectOwner,
    		taskType: taskType,
    		searchExpress: searchExpress
    	});
    },
    render: function(){
    	var radioGroupParam = {
            id: `projectFilter`,
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
        	selectedId:0,
        	options: API.getAllTemplateTaskTypes()
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
	    			<RadioGroup param={radioGroupParam} ref='projectOwnerRadioGroup'/>
    			</div>
    			<div className='line'>
    				<label>豆豆</label>
    				<ComboBox param={comboBoxParam}  ref='taskTypeComboBox'/>
    			</div>
    			<div className='line'>
    				<label>条件</label>
    				<Input param={inputParam}  ref='searchExpressInput'/>
    				<div className="expressSearchHint">
    					发动机<b>=</b>1.0T
    					<br/>
    					发动机<b>=</b>1.0T<b>&amp;</b>品牌<b>=</b>大众
    					<br/>
    					成本<b>=</b><b>*</b><b>|</b>重量<b>=</b><b>*</b>
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