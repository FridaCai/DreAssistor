import React from 'react';
import CTimeLine from './view/timeline.js';
import SubProjectList from './view/list_subproject.js';
import TaskDetail from './view/panel_taskdetail.js';
import TaskList from './view/list_task.js';
import API from './api.js';
import CreateProjectPopup from './view/popup_createproject.js';
import './page.less';

var PageProjectTime = React.createClass({
	getInitialState: function() {
        return {
            isLoading: true,
            selectedProject: undefined,
            projects: undefined,
            projectTemplateList: undefined,
        }
    },

    componentDidMount: function() {
        API.signal_projects_add.listen(((event, param) => {
            var addedProjects = param.projects;

            var projects = addedProjects.concat(this.state.projects);
            var projectTemplateList = this.state.projectTemplateList;

            this.setState({
                projects: projects,
                projectTemplateList: projectTemplateList,
            })
        }).bind(this));



        API.getData().then(
            (function(param) {
                var isLoading = false;
                var projects = param.projects;
                var projectTemplateList = param.allprojects;
                
                this.setState({
                    isLoading: false,
                    projects: projects,
                    projectTemplateList: projectTemplateList
                })
            }).bind(this)
        );
    },


    render: function() {
        if(this.state.isLoading) {
            return (<div>Loading...</div>);
        }else{
            return (<div className='pageProjectTime'>
                        <CTimeLine projects={this.state.projects}/>
                        <div className='leftContainer'>
                            <SubProjectList/>
                            <TaskList/>
                        </div>
                        <TaskDetail/>
                        <CreateProjectPopup 
                            projectTemplateList={this.state.projectTemplateList} 
                            projects={this.state.projects}/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
