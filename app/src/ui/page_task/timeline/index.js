import Timeline from './lib/Timeline.jsx';
import moment from 'moment';
import API from '../api.js';
import Util from '../../../util.js';
import Task from '../data/task.js';

var AddOn = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        
    },
    onSort: function() {

    },
    onFilter: function() {

    },
    onAdd: function() {
        //API.signal_addProjectPopup_show.dispatch();
    },
    render: function() {
        /*return (<div>
            <span>项目名称</span>
            <span className='hearderBtns'>
                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer'}} onClick={this.onSort} className='sortBtn'>sort</span>
                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} onClick={this.onFilter} className='filterBtn'>filter</span>
                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} onClick={this.onAdd} className='addBtn'>+</span>    
            </span>
            
        </div>
        )*/
        return null;
    }

});

var CTimeLine = React.createClass({
	getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
    	API.signal_timeline_task_create.listen(this.onTimelineTaskCreate);
    },
    
    componentDidUnMount: function() {
    	API.signal_timeline_task_create.unlisten(this.onTimelineTaskCreate);	
    },

    onTimelineTaskCreate: function(e, param){
    	var templateTask = API.getTemplateTasks().find(param.templateTaskId);

    	var taskObj = $.extend({}, templateTask);
    	taskObj = $.extend(taskObj, {	
    		id: Util.generateUUID(),
    		startTime: param.startTime,
    		endTime: param.endTime,
    	});

    	var task = new Task();
    	task.init(taskObj);

    	API.getTasks().addTask(task);
    	this.forceUpdate();
    },

    componentWillReceiveProps: function(newProps) {
       
    },
    render: function() {
        
        const groups = [
         {id: "0", title: 'Mast Timing'},
         {id: "1", title: 'Vehicle Building'},
         {id: "2", title: 'PT Cai'},
         {id: "3", title: 'AIS Development'},
        ];

        var items = [];
		API.getTaskArr().map(function(task){
			items.push({
				id: task.id,
				group: "0",
				title: task.label,
				start_time: task.startTime,
				end_time: task.endTime,
				color: Util.convertIntColorToHex(task.markColor),
                instance: task,
			})
		})
        /*items.push({
            id: '0',
            group: '0',
            title: 'DSI',
            time: Date.parse(new Date()),
            width: 50,
        });*/
        

        var filter = React.createElement(AddOn, {});
        var sidebarWidth = $(window).width() * 0.2;
        return (<div>
	               <Timeline groups={groups}
                        items={items}
                        defaultTimeStart={moment().add(-12, 'hour')}
                        defaultTimeEnd={moment().add(12, 'hour')}
                        canMove={true}
                        canResize={true}
                        canChangeGroup={true}
                        useResizeHandle={true}
                        stackItems={true}
                        fixedHeader={'fixed'}
                        sidebarWidth={sidebarWidth}
                        children={filter}/>
                </div>
		);
    }
});

module.exports = CTimeLine;
