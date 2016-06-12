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
    	var task = new Task();
    	task.init({
			id: Util.generateUUID(),
    		name: '',
    		desc: '',
    		startTime: moment().add(-6, 'months').valueOf(),
    		endTime: moment().add(6, 'months').valueOf(),
    		markColor: 0,
    		attachedFiles: [],
    		creatorId: '',
    		priority: 0,
    		subtasks: [],
    		privacy: 0,
    		template: {
    			type: 0,
    		}
		});
		
		API.signal_taskpopup_show.dispatch({
			task: task,
			onOKHandler: function(param){
				task.update(param);
				API.addTask(task);
			},
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
    onEditTaskClk: function(){
    	API.signal_taskpopup_show.dispatch();
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
							<a className='task' href='javascript:void(0);' style={style} key={id}
									onClick={this.onEditTaskClk.bind(this, id)}>
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


