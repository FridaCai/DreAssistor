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
        if(!this.state.taskObj)
            return null;

        const {
          label, desc, startTime, endTime, subtasks, markColor, priority, attachments, privacy, template, onOKHandler,
        } = this.state.taskObj;

        var color = Util.convertIntColorToHex(markColor);

	    return (
	        <div className="panel-body taskPopup">
            	<div className='line name'>
            		<label>名称</label>
            		<input type="text" defaultValue={label} ref='labelInput'/>
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
                    <BreakDownList subtasks={subtasks} ref='breakdownList'/>
            	</div>

				<div className="line markColor">
                    <label>颜色</label>
                    <ColorPicker
                      animation="slide-up"
                      color={color} ref='markColorCP'/>
                </div>
                <div className="line priority">
                    <label>优先级</label>
                    <span ref='priorityDropdown'></span>
                </div>

                <div className="line attachedFiles">
                	<label>附件</label>
                    <AttachmentList attachments={attachments} ref='attachmentlist'/>
                </div>
                <div className="line privacy">
                    <label>谁可以看</label>
                    <PrivacyRadioGroup privacy={privacy} ref='privacyRadioGroup'/>
                </div>


                <div className="line taskType">
                    <label>豆豆类型</label>
                    <TaskTemplatePanel template={template} ref='templatePanel'/>
                </div>
	        </div>
	    );   
    },
    updateJqueryComponent: function() {
    	(function updatePriorityDropdown(){
            var defaultKey = this.state.taskObj.priority;
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
	        
	        var param = {
	            id: "priorityDropdown", //string.
	            defaultKey: defaultKey, //string. existed id in options.
	            options: options,
	            onchange: (function(key){
	                
	            }).bind(this),
	        };
	        this.priorityDropdown = CDropDown.create(container, param);
    	}).call(this);
    },

    onOkClk:function() {
        var label = this.refs.labelInput.value;
        var desc = this.refs.descTA.value;
        var startTime = this.refs.startTimeDT.state.selectedDate.valueOf();
        var endTime = this.refs.endTimeDT.state.selectedDate.valueOf();
        var subtasks = this.refs.breakdownList.getValue();
        var markColor = Util.convertHexColorToInt(this.refs.markColorCP.state.color);
        var priority = this.priorityDropdown.getValue();  
        var attachments = this.refs.attachmentlist.getValue();
        var privacy = this.refs.privacyRadioGroup.getValue();
        var template = this.refs.templatePanel.getValue();

        this.state.onOKHandler({
            label: label,
            desc: desc,
            startTime: startTime,
            endTime: endTime,
            subtasks: subtasks,
            markColor: markColor,
            priority: priority,
            attachments: attachments,
            privacy: privacy,
            template: template,
        });
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = TaskPopup;


