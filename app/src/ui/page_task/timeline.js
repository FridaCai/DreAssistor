import React from 'react';
import Timeline from './timeline/index.js';
import moment from 'moment';
//import API from '../api.js';

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

    },
    componentWillReceiveProps: function(newProps) {
       
    },
    render: function() {
        const groups = [
         {id: 1, title: 'project 1'},
         {id: 2, title: 'project 2'}
        ];
 
        const items = [
         {id: 1, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour')},
         {id: 2, group: 2, title: 'item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour')},
         {id: 3, group: 1, title: 'item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour')}
        ];

    	/*var projects = API.getProjects();

		var groups = [];
    	projects.forEach(function(project){
    		groups.push({
    			id: project.projectId  '_' + project.mobileYearId,
    			title: project.name,
    			isSub: false,
                instance: project,
    		});

    		project.children.forEach(function(subproject){
                if(subproject.isShow){
                    groups.push({
                        id: subproject.id,
                        title: subproject.name,
                        isSub: true,
                        instance: subproject,
                    })    
                }
    		});
    	});

    	var items = [];
    	projects.forEach(function(project){
    		project.tasks.forEach(function(task){
    			var itm = {
    				id: task.id,
    				group: project.projectId + "_" + project.mobileYearId,
    				title: task.name,
    				start_time: task.startTime,
    				end_time: task.endTime, 
                    instance: task,
    			};
    			items.push(itm);
    		});

    		project.children.forEach(function(subproject) {
    			subproject.tasks.forEach(function(task){
    				var itm = {
	    				id: task.id,
	    				group: subproject.id,
	    				title: task.name,
	    				start_time: task.startTime,
	    				end_time: task.endTime, 
                        instance: task,
	    			};
	    			items.push(itm);
    			});
    		});
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
