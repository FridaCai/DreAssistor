import Timeline from '../../widget/timeline/index.js';
import moment from 'moment';


var AddOn = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        
    },
    render: function() {
        return (<div>
            项目名称
            <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer'}}>sort</span>
            <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}}>filter</span>
        </div>
        )
    }

});

var CTimeLine = React.createClass({

	
	getInitialState: function() {
        return {
        	data: this.props.data,
        }
    },
    componentDidMount: function() {
        
    },
    render: function() {
    	var projects = this.state.data.projects;

		var groups = [];
    	projects.forEach(function(project){
    		groups.push({
    			id: project.id,
    			title: project.name,
    			isSub: false,
    		});

    		project.children.forEach(function(subproject){
    			groups.push({
    				id: subproject.id,
    				title: subproject.name,
    				isSub: true,
    			})
    		});
    	});

    	var items = [];
    	projects.forEach(function(project){
    		project.task.forEach(function(task){
    			var itm = {
    				id: task.id,
    				group: project.id,
    				title: task.name,
    				start_time: task.startTime,
    				end_time: task.endTime, 
    			};
    			items.push(itm);
    		});

    		project.children.forEach(function(subproject) {
    			subproject.task.forEach(function(task){
    				var itm = {
	    				id: task.id,
	    				group: subproject.id,
	    				title: task.name,
	    				start_time: task.startTime,
	    				end_time: task.endTime, 
	    			};
	    			items.push(itm);
    			});
    		});
    	});

        var filter = React.createElement(AddOn, {});


        var sidebarWidth = $(window).width() * 0.2;


//<div style={{width: '80%', height: '150px', overflowY: 'scroll', overflowX:'hidden'}}> //what about overflow-y???
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
