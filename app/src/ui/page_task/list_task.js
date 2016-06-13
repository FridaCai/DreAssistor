import API from './api.js';
import Task from './data/task.js';
import Util from '../../util.js';
import moment from 'moment';

var TaskList = React.createClass({
	getInitialState: function() {
        return {
        	tasks: [],
        }
    },
    onAddTaskBtnClk: function(){
        var id = Util.generateUUID();

		API.signal_taskpopup_show.dispatch({
            title: '添加豆豆',
			taskObj: {
                label: '未命名',
                desc: '',
                startTime: moment().add(-6, 'months').valueOf(),
                endTime: moment().add(6, 'months').valueOf(),
                markColor: 0,
                attachments: [],
                creatorId: '',
                priority: 0,
                subtasks: [],
                privacy: 0,
                template: {
                    type: 0,
                }
            },
			onOKHandler: (function(taskObj){
                var task = new Task();
				task.init($.extend(true, {id: id}, taskObj));
				API.getTasks().addTask(task);
                this.forceUpdate();                
			}).bind(this),
		});
    },

    onEditTaskClk: function(task){
        API.signal_taskpopup_show.dispatch({
            title: '编辑豆豆',
            taskObj: $.extend(true, {}, task),
            onOKHandler: (function(taskObj){
                task.update(taskObj);
                this.forceUpdate();
            }).bind(this),
        });
    },

    componentDidMount: function(){
    	var url = '/app/res/mockupapi/get_tasks.json';
    	Util.getData(url).then((function(param){
    		if(param.errCode !== -1)
    			return;


    		API.setTasks(param.tasks);
    		this.forceUpdate();
    	}).bind(this));
    },

    render: function() {
        return (
            <div className='taskList'>
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>
				{
					API.getTaskArr().map((function(task){
						var id = task.id;
						var label = task.label;
						var style = {
							backgroundColor: Util.convertIntColorToHex(task.markColor),
						}
						return (
							<a draggable='true' className='task' style={style} key={id}
									onClick={this.onEditTaskClk.bind(this, task)}>
								{label}
							</a>
						)
					}).bind(this))
				}
            </div>
        );    
    }
});

module.exports = TaskList;


