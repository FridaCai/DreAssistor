import Util from 'Util';
import API from '../api.js';
import GlobalAPI from 'api';
import moment from 'moment';

import MessageBox from 'MessageBox';
import Time from 'Time';
import ColorPicker from 'ColorPicker';
import ComboBox from 'ComboBox';
import Input from 'Input';
import TextArea from 'TextArea';
import BreakDownList from './breakdown_list.js';
import AttachmentList from 'AttachmentList';
import TaskTemplatePanel from './template.js';
import RadioGroup from 'RadioGroup';

import Attachments from '../data/attachments.js';

var TaskPopup = React.createClass({
	getInitialState: function() {
        return {
            task: this.props.task,
            title: this.props.title,
            onOK: this.props.onOK,
            isReadOnly: this.props.isReadOnly
        };
    },
    
	getContent: function() {
        try{
            const isReadOnly = this.state.isReadOnly;
            const {
              id, label, desc, exp, startTime, endTime, subtasks, markColor, priority, attachment, privacy, template
            } = this.state.task;
            
            var project = (this.state.task.parent && this.state.task.parent.parent) ? this.state.task.parent.parent: null; 
            var templateLbl = GlobalAPI.getTemplateEnum()
                .find((function(item){
                    return item.id == this.state.task.template.type;
                }).bind(this))
                .label;

            var priority = priority ? priority : 0;
            var priorityComboBox = {
                id: 'priorityComboBox',
                selectedId: priority,
                options:  [{
                    id: 0,
                    label:"低"
                },{
                    id: 1,
                    label: "中"
                },{
                    id: 2,
                    label: "高"
                }],
                isReadOnly: isReadOnly
            };

            
            var labelParam = {
                value: label,
                isReadOnly: isReadOnly
            }
            var descParam = {
                value: desc,
                isReadOnly: isReadOnly
            }
            var expParam = {
                value: exp,
                isReadOnly: isReadOnly
            }
            var startTimeParam={
                value: startTime,
                isReadOnly: isReadOnly
            }
            var endTimeParam={
                value: endTime,
                isReadOnly: isReadOnly
            }

            var breakdownListParam = {
                subtasks: subtasks,
                isReadOnly: isReadOnly
            }

            var color = Util.convertIntColorToHex(markColor);
            var colorPickerParam = {
                value: color,
                isReadOnly: isReadOnly
            }

            var privacy = privacy ? privacy : 0;
            var privacyRadioGroupParam = {
                id: 'privacyRadioGroup',
                selectedId: privacy,
                options: [
                    {
                        id: 0,
                        label: '所有人'
                    },
                    {
                        id: 1,
                        label: '仅自己可见'
                    }
                ],
                isReadOnly: isReadOnly
            }

            return (
                <div className="panel-body">
                    <div className='line name'>
                        <label>名称</label>
                        <Input ref='labelInput' param={labelParam}/>
                    </div>
                    
                    <div className='line desc'>
                        <label>备注</label>
                        <TextArea ref='descTA' param={descParam}/>
                    </div>

                   <div className='line exp'>
                        <label>经验分享</label>
                        <TextArea ref='expTA' param={expParam}/>
                    </div>

                    <div className='line startTime'>
                        <label>起始时间</label>
                        <Time ref='startTimeDT' param={startTimeParam}/>
                    </div>

                    <div className='line endTime'>
                        <label>结束时间</label>
                        <Time ref='endTimeDT' param={endTimeParam}/>
                    </div>

                    <div className='line breakdownList'>
                        <label>子豆豆</label>
                        <BreakDownList ref='breakdownList' param={breakdownListParam}/> 
                    </div>

                    <div className="line markColor">
                        <label>颜色</label>
                        <ColorPicker ref='markColorCP' param={colorPickerParam}/>
                    </div>
                    <div className="line priority">
                        <label>优先级</label>
                        <ComboBox ref='priorityComboBox' param={priorityComboBox}/>
                    </div>

                    <div className="line attachedFiles">
                        <label>附件</label>
                        <AttachmentList 
                            isReadOnly={isReadOnly} 
                            attachment={attachment || new Attachments()} 
                            taskId={id} 
                            ref='attachmentlist'/>
                    </div>
                    <div className="line privacy">
                        <label>谁可以看</label>
                        <RadioGroup param={privacyRadioGroupParam} ref='privacyRadioGroup'/>
                    </div>

                    <div className="line taskType">
                        <label>豆豆类型</label>
                        <span>{templateLbl}</span>
                        <TaskTemplatePanel template={template} project={project} isReadOnly={isReadOnly} ref='templatePanel'/>
                    </div>
                </div>
            );   
        }catch(e){
            console.error(e.stack);
        }
        
    },

    componentWillUnmount: function(){
    },


    onOK:function() {
        this.state.task.label = this.refs.labelInput.getValue();
        this.state.task.desc = this.refs.descTA.getValue();
        this.state.task.exp = this.refs.expTA.getValue();
        this.state.task.startTime = this.refs.startTimeDT.getValue();
        this.state.task.endTime = this.refs.endTimeDT.getValue();
        this.state.task.subtasks = this.refs.breakdownList.getValue();
        this.state.task.markColor = Util.convertHexColorToInt(this.refs.markColorCP.getValue());
        this.state.task.priority = this.refs.priorityComboBox.getValue();  
        this.state.task.attachment  = this.refs.attachmentlist.getValue();
        this.state.task.privacy = this.refs.privacyRadioGroup.getValue();
        this.state.task.template = this.refs.templatePanel.getValue();

        this.state.onOK(this.state.task);
        return Promise.resolve();
    },
    render: function() {
        var content = this.getContent();
        var {isReadOnly, title} = this.state;
        return (<MessageBox isReadOnly={isReadOnly} cName='taskPopup' title={title} onOK={this.onOK} ref='msgbox' children={content} isShow={true}/>);
    },
});

module.exports = TaskPopup;


