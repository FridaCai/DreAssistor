import moment from 'moment';
import API from '../api.js';
import TemplateTask from '../data/templatetask.js';
import Request from '../../../request.js';
import Util from 'Util';
import MessageBox from 'MessageBox';
import TemplateTasks from '../../../config/get_template_tasks';
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
        //todo: template task both used in timeline page and statical page.
        //load data not only in timeline page.
        
        var tasks = TemplateTasks;
        API.setTemplateTasks(tasks); 
        

        var templateenum = tasks.map(function(task){
            return {id: task.id, label: task.label}
        });
        API.setTemplateEnum(templateenum);

        return (
            <div className='taskList'>
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>

				{
					API.getTemplateTasks().map((function(task){
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

