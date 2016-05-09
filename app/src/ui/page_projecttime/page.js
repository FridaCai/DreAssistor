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
            projectList: undefined,
            projectTemplateList: undefined,
        }
    },

    componentDidMount: function() {
        API.signal_projects_add.listen(((event, param) => {
            var addedProjects = param.projects;

            var projectList = addedProjects.concat(this.state.projectList);
            var projectTemplateList = this.state.projectTemplateList;

            this.setState({
                projectList: projectList,
                projectTemplateList: projectTemplateList,
            })
        }).bind(this));



        API.getData().then(
            (function(param) {
                var isLoading = false;
                var projectList = param.projects;
                var projectTemplateList = param.allprojects;
                
                this.setState({
                    isLoading: false,
                    projectList: projectList,
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
                        <CTimeLine projectList={this.state.projectList}/>
                        <div className='leftContainer'>
                            <SubProjectList/>
                            <TaskList/>
                        </div>
                        <TaskDetail/>
                        <CreateProjectPopup 
                            projectTemplateList={this.state.projectTemplateList} 
                            projectList={this.state.projectList}/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
