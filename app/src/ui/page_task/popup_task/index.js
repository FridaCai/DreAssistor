import Util from '../../../util.js';
import MessageBox from '../../widget/messagebox.js';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import CDropDown from '../../widget/dropdown/dropdown.js';
import moment from 'moment';

import BreakDownList from './breakdown_list.js';
import AttachmentList from './attachment_list.js';
import TaskTemplatePanel from './template.js';
import PrivacyRadioGroup from './privacy_radiogroup.js';

var TaskPopup = React.createClass({
    priorityDropdown: undefined,

	getInitialState: function() {
        return {};
    },
    
    show: function(state) {
    	var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },

	getContent: function() {
        if(!this.state.task)
            return null;

        const {
          label, desc, startTime, endTime, subtasks, _markColor, priority, attachments, privacy, template, onOKHandler,
        } = this.state.task;

        var markColor = Util.convertIntColorToHex(_markColor);

	    return (
	        <div className="panel-body taskPopup">
            	<div className='line name'>
            		<label>名称</label>
            		<input type="text" defaultValue={name} ref='nameInput'/>
            	</div>
            	
            	<div className='line desc'>
            		<label>备注</label>
            		<textarea defaultValue={desc} ref='descTA'></textarea>
            	</div>

            	<div className='line startTime'>
            		<label>起始时间</label>
            		<div className='datetime'>
                        <Datetime defaultValue={startTime} ref='startTimeDT'/>
                    </div>
            	</div>

            	<div className='line endTime'>
            		<label>结束时间</label>
            		<div className='datetime'>
                        <Datetime defaultValue={endTime} ref='endTimeDT'/>
                    </div>
            	</div>

            	<div className='line breakdownList'>
            		<label>子豆豆</label>
                    <BreakDownList task={this.state.task}/>
            	</div>

				<div className="line markColor">
                    <label>颜色</label>
                    <ColorPicker
                      animation="slide-up"
                      color={markColor} ref='markColorCP'/>
                </div>
                <div className="line priority">
                    <label>优先级</label>
                    <span ref='priorityDropdown'></span>
                </div>

                <div className="line attachedFiles">
                	<label>附件</label>
                    <AttachmentList task={this.state.task}/>
                </div>
                <div className="line privacy">
                    <label>谁可以看</label>
                    <PrivacyRadioGroup privacy={privacy}/>
                </div>


                <div className="line taskType">
                    <label>豆豆模版</label>
                    <TaskTemplatePanel template={template}/>
                </div>
	        </div>
	    );   
    },
    updateJqueryComponent: function() {
    	(function updatePriorityDropdown(){
    		var container = this.refs.priorityDropdown;
	        var options = [{
	            id: 0,
	            label:"低"
	        },{
	            id: 1,
	            label: "中"
	        },{
	            id: 2,
	            label: "高"
	        }];
	        var defaultKey = this.state.priority;
	        var param = {
	            id: "priorityDropdown", //string.
	            defaultKey: defaultKey, //string. existed id in options.
	            options: options,
	            onchange: (function(key){
	                this.setState({priority: key});
	            }).bind(this),
	        };
	        this.priorityDropdown = CDropDown.create(container, param);
    	}).call(this);
    },

    onOkClk:function() {
        var name = this.refs.nameInput.value;
        var startTime = this.refs.startTimeDT.state.selectedDate.valueOf();
        var endTime = this.refs.endTimeDT.state.selectedDate.valueOf();
        var desc = this.refs.descTA.value;
        var markColor = parseInt(this.refs.markColorCP.state.color.replace('#', '0x'));
        var attachments = [];
        var priority = this.priorityDropdown.getValue();  

        /*this.state.onOKHandler({
            name: name,
            startTime: startTime,
            endTime: endTime,
            desc: desc, 
            markColor: markColor,
            attachments: attachments, //wrong.
            priority: priority,
        })*/
    },
    render: function() {
        var content = this.getContent();
        return (<MessageBox width={700} title={'添加豆豆'} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = TaskPopup;


