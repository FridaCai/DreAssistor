import Timeline from './lib/Timeline.jsx';
import moment from 'moment';
import API from '../api.js';
import Util from '../../../util.js';
import Task from '../data/task.js';
import Tag from '../data/tag.js';

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
        var groups = [];
        API.getProjectArr().map(function(p){
            p.children.map(function(sp){
                groups.push({
                    id: sp.id,
                    title: sp.label,
                })
            })
        });

        var items = [];
        API.getProjectArr().map(function(p){
            p.children.map(function(sp){
                var spId = sp.id;
                sp.children.map(function(child){
                    if(child instanceof Tag) {
                        items.push({
                            id: child.id,
                            group: spId,
                            title: child.label,
                            start_time: child.time,
                            end_time: child.time+1,
                            color: Util.convertIntColorToHex(child.markColor),
                            instance: child,
                        })
                    }else if (child instanceof Task){
                        items.push({
                            id: child.id,
                            group: spId,
                            title: child.label,
                            start_time: child.startTime,
                            end_time: child.endTime,
                            color: Util.convertIntColorToHex(child.markColor),
                            instance: child,
                        })
                    }
                })    
            })
        });

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
