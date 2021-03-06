import API from '../api.js';
import GlobalAPI from 'api';
import Util from 'Util';
import MessageBox from 'MessageBox';
import './style.less';

var TemplateTaskList = React.createClass({
	getInitialState: function() {
        return {
        	tasks: [],
        }
    },
    onAddTaskBtnClk: function(){
        var info = '想添加新的豆豆模版？请将需求描述提交给开发人员：525311175@qq.com.';
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<MessageBox msg={info} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
    },

    onEditTaskClk: function(task){
        return;
        API.signal_taskpopup_show.dispatch({
            title: '编辑豆豆',
            task: task,
            onOK: (function(){
                this.forceUpdate();
            }).bind(this),
        });
    },

    onDragOver: function(e){
        e.preventDefault(); // allows us to drop
    },
    onDragStart: function(task, e){
        e.dataTransfer.setData("text", task.template.type.toString());
    },
    
    render: function() {
        return (
            <div className='taskList'>
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>

				{
					GlobalAPI.getTemplateTasks().map((function(task){
						var id = task.id;
						var label = task.label;
						var style = {
							backgroundColor: Util.convertIntColorToHex(task.markColor),
						}
						return (
							<a href='javascript:void(0);' 
                                draggable='true' className='task' style={style} key={id}
								onClick={this.onEditTaskClk.bind(this, task)}
                                onDragOver={this.onDragOver}
                                onDragStart={this.onDragStart.bind(this, task)}>
								{label}
							</a>
						)
					}).bind(this))
				}
                <div ref='popup' className='popup'></div>

            </div>
        );    
    }
});

module.exports = TemplateTaskList;

