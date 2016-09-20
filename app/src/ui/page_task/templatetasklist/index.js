import moment from 'moment';
import API from '../api.js';
import TemplateTask from '../data/templatetask.js';
import  Request from '../../../request.js';
import Util from 'Util';
import MessageBox from 'MessageBox';

var TemplateTaskList = React.createClass({
	getInitialState: function() {
        return {
        	tasks: [],
        }
    },
    onAddTaskBtnClk: function(){
        this.refs.msgbox.show({});
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

    componentDidMount: function(){
        var url = Request.getMockupAPI('get_template_tasks.json');

        Request.getData(url).then((function(param){
    		if(param.errCode !== -1)
    			return;

            var tasks = param.tasks;
    		API.setTemplateTasks(tasks);
            

            var templateenum = tasks.map(function(task){
                return {id: task.id, label: task.label}
            });
            API.setTemplateEnum(templateenum);


    		this.forceUpdate();
    	}).bind(this));
    },

    onDragOver: function(e){
      e.preventDefault(); //otherwise, ondrop does not work.
    },
    onDragStart: function(task, e){
        e.dataTransfer.setData("text", task.template.type);
    },
   
    render: function() {
        //<MessageBox ref='msgbox' msg='想添加新的豆豆模版？请将需求描述提交给开发人员：525311175@qq.com.'/>
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
							<a draggable='true' className='task' style={style} key={id}
									onClick={this.onEditTaskClk.bind(this, task)}
                                        onDragOver={this.onDragOver}
                                        onDragStart={this.onDragStart.bind(this, task)}>
								{label}
							</a>
						)
					}).bind(this))
				}
            </div>
        );    
    }
});

module.exports = TemplateTaskList;

