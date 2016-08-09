import Util from 'Util';
import API from '../api.js';
import MessageBox from 'MessageBox';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import CDropDown from 'CDropDown';
import moment from 'moment';

import BreakDownList from './breakdown_list.js';
import AttachmentList from './attachment_list.js';
import TaskTemplatePanel from './template.js';
import PrivacyRadioGroup from './privacy_radiogroup.js';

var TaskPopup = React.createClass({
    priorityDropdown: undefined,

	getInitialState: function() {
        return {
            task: this.props.task,
            title: this.props.title,
            onOK: this.props.onOK,
        };
    },
    
	getContent: function() {
        try{
            const {
              label, desc, startTime, endTime, subtasks, markColor, priority, attachments, privacy, template
            } = this.state.task;

            var color = Util.convertIntColorToHex(markColor);
            var project = (this.state.task.parent && this.state.task.parent.parent) ? this.state.task.parent.parent: null; 
            var templateLbl = API.getTemplateEnum()
                .find((function(item){
                    return item.id == this.state.task.template.type;
                }).bind(this))
                .label;
            return (
                <div className="panel-body">
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
                        <span>{templateLbl}</span>
                        <TaskTemplatePanel template={template} project={project} ref='templatePanel'/>
                    </div>
                </div>
            );   
        }catch(e){
            console.error(e.stack);
        }
        
    },
    componentDidMount: function(){
        this.updateJqueryComponent();
    },
    componentWillUnmount: function(){
    },
    updateJqueryComponent: function() {
    	(function updatePriorityDropdown(){
            var defaultKey = this.state.task.priority;
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

    onOK:function() {
        this.state.task.label = this.refs.labelInput.value;
        this.state.task.desc = this.refs.descTA.value;
        this.state.task.startTime = this.refs.startTimeDT.state.selectedDate.valueOf();
        this.state.task.endTime = this.refs.endTimeDT.state.selectedDate.valueOf();
        this.state.task.subtasks = this.refs.breakdownList.getValue();
        this.state.task.markColor = Util.convertHexColorToInt(this.refs.markColorCP.state.color);
        this.state.task.priority = this.priorityDropdown.getValue();  
        this.state.task.attachments  = this.refs.attachmentlist.getValue();
        this.state.task.privacy = this.refs.privacyRadioGroup.getValue();
        this.state.task.template = this.refs.templatePanel.getValue();

        this.state.onOK();
        return Promise.resolve();
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox cName='taskPopup' width={700} title={title} onOK={this.onOK} ref='msgbox' children={content} isShow={true}/>);
    },
});

module.exports = TaskPopup;


