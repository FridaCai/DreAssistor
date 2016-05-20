import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import CDropDown from '../../widget/dropdown/dropdown.js';



var TaskPopup = React.createClass({

	getInitialState: function() {
        this.priorityDropdown = undefined;
        return {
            popupTitle: '',
            name: '',
            startTime: 0,
            endTime: 0,
            desc: '',
            markColor: 0,
            attachedFiles: [],
            priority: 1,
            onOKHandler: undefined,
        }
    },

    show: function(newState) {
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
  
    render: function() {
        var content = this.getContent();
        return (<MessageBox width={700} title={this.state.popupTitle} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },

    updateJqueryComponent: function() {
        var container = this.refs.priorityDropdown;

        //hardcode :<
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
    },


    onOkClk:function() {
        var name = this.refs.nameInput.value;
        var startTime = this.refs.startTimeDT.state.selectedDate.valueOf();
        var endTime = this.refs.endTimeDT.state.selectedDate.valueOf();
        var desc = this.refs.descTA.value;
        var markColor = parseInt(this.refs.markColorCP.state.color.replace('#', '0x'));
        var attachedFiles = [];
        var priority = this.priorityDropdown.getValue();  

        this.state.onOKHandler({
            name: name,
            startTime: startTime,
            endTime: endTime,
            desc: desc, 
            markColor: markColor,
            attachedFiles: attachedFiles, //wrong.
            priority: priority,
        })
    },

    componentDidMount: function() {
        
    },

    getContent: function() {
        const {
          popupTitle, name, desc, attachedFiles, priority, onOKHandler,
        } = this.state;

        var startTime = this.state.startTime;
        var endTime = this.state.endTime;
        var markColor = (function(color){
            color = color ? color.toString(16) : '';
            color = new Array(6 - color.length + 1).join('0') + color;
            return '#' + color;
        })(this.state.markColor);

        return (
            <div className="taskDetail">
                <div className="taskDesc">
                  <label>任务描述</label>
                  <textarea defaultValue={desc} ref='descTA'></textarea>
                </div>

                <div className="taskInfo">
                    <div className="line">
                        <label>任务名称</label>
                        <input type="text" defaultValue={name} ref='nameInput'/>
                    </div>
                    <div className="line">
                        <label>开始日期</label>
                        <div className='datetime'>
                            <Datetime defaultValue={startTime} ref='startTimeDT'/>
                        </div>
                    </div>
                    <div className="line">
                        <label>结束日期</label>
                        <div className='datetime'>
                            <Datetime defaultValue={endTime} ref='endTimeDT'/>
                        </div>
                    </div>
                    <div className="line">
                        <label>颜色</label>
                        <ColorPicker
                          animation="slide-up"
                          color={markColor} ref='markColorCP'/>
                    </div>
                    <div className="line">
                        <label>优先级</label>
                        <span ref='priorityDropdown'></span>
                    </div>
                </div>

                <div className="attachedFiles">
                {
                    attachedFiles.map(function(file){
                        return (<span>{file}</span>)
                    })
                }
                </div>
            </div>
        );
    },

});

module.exports = TaskPopup;
