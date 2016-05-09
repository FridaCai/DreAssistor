import React from 'react';
import Timeline from './timeline/index.js';
import moment from 'moment';
import API from '../api.js';

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
        API.signal_appProjectPopup_show.dispatch();
    },
    render: function() {
        return (<div>
            项目名称
            <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer'}} onClick={this.onSort}>sort</span>
            <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} onClick={this.onFilter}>filter</span>
            <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} onClick={this.onAdd}>+</span>
        </div>
        )
    }

});

var CTimeLine = React.createClass({
	getInitialState: function() {
        return {
        	projects: this.props.projects,
        }
    },
    componentDidMount: function() {

    },
    componentWillReceiveProps: function(newProps) {
        this.setState({
            projects: newProps.projects,
        })
    },
    render: function() {
    	var projects = this.state.projects;

		var groups = [];
    	projects.forEach(function(project){
    		groups.push({
    			id: project.projectId + '_' + project.mobileYearId,
                projectId: project.projectId,
                mobileYearId: project.mobileYearId,
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
