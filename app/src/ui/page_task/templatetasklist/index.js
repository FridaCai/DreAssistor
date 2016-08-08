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

    onDrag: function(){
        console.log('task: onDrag');
    },
    onDragEnd: function(e){
        
        console.log('task: onDragEnd')
    },
    onDragEnter: function(){
        console.log('task: onDragEnter')
    },
    onDragExit: function(){
        //never called...
        console.log('task: onDragExit')
    },
    onDragLeave: function(){
        console.log('task: onDragLeave')
    },
    onDragOver: function(e){
      e.preventDefault(); //otherwise, ondrop does not work.
    },
    onDragStart: function(task, e){
        e.dataTransfer.setData("text", task.id);
    },
    onDrop: function(){
        //never called...
        console.log('task: onDrop')
    },
    render: function() {
        return (
            <div className='taskList'>
                <MessageBox ref='msgbox' msg='想添加新的豆豆模版？请将需求描述提交给开发人员：525311175@qq.com.'/>
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>
				{
					API.getTemplateTaskArr().map((function(task){
						var id = task.id;
						var label = task.label;
						var style = {
							backgroundColor: Util.convertIntColorToHex(task.markColor),
						}
						return (
							<a draggable='true' className='task' style={style} key={id}
									onClick={this.onEditTaskClk.bind(this, task)}
                                        onDrag={this.onDrag}
                                        onDragEnd={this.onDragEnd}
                                        onDragEnter={this.onDragEnter}
                                        onDragExit={this.onDragExit}
                                        onDragLeave={this.onDragLeave}
                                        onDragOver={this.onDragOver}
                                        onDragStart={this.onDragStart.bind(this, task)}
                                        onDrop={this.onDrop}
                                        >
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

