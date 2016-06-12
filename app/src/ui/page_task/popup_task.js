import API from '../../api.js';
import MessageBox from '../widget/messagebox.js';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import CDropDown from '../widget/dropdown/dropdown.js';
import moment from 'moment';

//import TaskTemplatePanel from './panel_tasktemplate.js';

var BreakDownList = React.createClass({
    render: function(){
        return (
            <div className='listContainer'>
                <ul className="list-group">
                  <li className="list-group-item">
                    Cras justo odio
                    <div className='buttonGroup'>
                        <input name='status' type="radio" defaultValue='done'/>
                        <label>完成</label>
                        <input name="status" type="radio" defaultValue='notDone'/>
                        <label>未完成</label>
                        <button className='btn btn-default deleteBtn'>Delete</button>
                    </div>
                  </li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                  <li className="list-group-item">Morbi leo risus</li>
                  <li className="list-group-item">Porta ac consectetur ac</li>
                  <li className="list-group-item">Vestibulum at eros</li>
                </ul>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="请输入子豆豆名称" />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button">添加子豆豆</button>
                  </span>
                </div>
            </div>
        )
    }
});


var AttachmentList = React.createClass({
    render: function(){
        return (
            <div className='listContainer'>
                <ul className="list-group">
                  <li className="list-group-item">
                    Cras justo odio
                    <div className='buttonGroup'>
                        <button className='btn btn-default deleteBtn'>Delete</button>
                    </div>
                  </li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                  <li className="list-group-item">Morbi leo risus</li>
                  <li className="list-group-item">Porta ac consectetur ac</li>
                  <li className="list-group-item">Vestibulum at eros</li>
                </ul>
                <a href='javascript:void(0);'>添加附件</a>
            </div>
        )
    }
});


var TaskPopup = React.createClass({
	getInitialState: function() {
        this.priorityDropdown = undefined;
        return {
            name: '未命名',
            desc: '',
            startTime: moment().add(-6, 'months').valueOf(),
            endTime: moment().add(6, 'months').valueOf(),
            breakdownlist: [{
            	id: '0',
            	label: '任务子项1',
            	isDone: false,
            }],
            markColor: 0,
            priority: 1,
            attachedFiles: ['attachment1'],
            onOKHandler: undefined,
            taskTemplateType: 0,
        }
    },
    
    show: function(state) {
    	var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },

	getContent: function() {/*<TaskTemplatePanel refs='taskTemplatePanel'/>*/
        const {
          name, desc, startTime, endTime, breakdownList,  priority, attachedFiles, onOKHandler,
        } = this.state;

        var markColor = (function(color){
            color = color ? color.toString(16) : '';
            color = new Array(6 - color.length + 1).join('0') + color;
            return '#' + color;
        })(this.state.markColor);

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

            	<div className='line breakdownlist'>
            		<label>子豆豆</label>
                    <BreakDownList/>
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
                    <AttachmentList/>
                </div>
                <div className="line privacy">
                    <label>谁可以看</label>
                    <div className='options'>
                        <label>仅自己可见</label>
                        <input type='radio'/>
                        <label>所有人</label>
                        <input type='radio'/>
                    </div>
                </div>


                <div className="line taskType">
                    <label>任务模版</label>
                    <span ref='taskTemplateDropdown'/>
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




    	(function updateTaskTemplateDropdown(){
    		var container = this.refs.taskTemplateDropdown;
	        var options = [{
	            id: 0,
	            label: "Hot Issue 模版"
	        },{
	            id: 1,
	            label: "尺寸检测模版"
	        }];

	        var defaultKey = this.state.taskTemplateType;
	        var param = {
	            id: "taskTemplateDropdown", //string.
	            defaultKey: defaultKey, //string. existed id in options.
	            options: options,
	            onchange: (function(key){
	            	//this.refs.taskTemplatePanel.updateByType(key);
	            }).bind(this),
	        };
	        this.taskTemplateDropdown = CDropDown.create(container, param);
    	}).call(this);
    },

    onOkClk:function() {
        var name = this.refs.nameInput.value;
        var startTime = this.refs.startTimeDT.state.selectedDate.valueOf();
        var endTime = this.refs.endTimeDT.state.selectedDate.valueOf();
        var desc = this.refs.descTA.value;
        var markColor = parseInt(this.refs.markColorCP.state.color.replace('#', '0x'));
        var attachedFiles = [];
        var priority = this.priorityDropdown.getValue();  

        /*this.state.onOKHandler({
            name: name,
            startTime: startTime,
            endTime: endTime,
            desc: desc, 
            markColor: markColor,
            attachedFiles: attachedFiles, //wrong.
            priority: priority,
        })*/
    },
    render: function() {
        var content = this.getContent();
        return (<MessageBox width={700} title={this.state.popupTitle} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = TaskPopup;


