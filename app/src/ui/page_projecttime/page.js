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

    getProjectTemplateList: function(projectList, templateList){
        //process templates for project creation purpose.
        //remove already added project.

        //step1: go though all mobile year in template, 
        //if(projectId, mobileYearId) exists in projectList
        //marked as deprecated.

        var existInProjectList = function(projectId, mobileYearId) {
            var found = projectList.find(function(project){
                return (project.projectId === projectId && project.mobileYearId === mobileYearId);
            })

            if(found)
                return true;
            return false;
        }

        var templates = [].concat(templateList);
        templates.map(function(template) {
            template.mobileYears.map(function(mobileYear){
                if (existInProjectList(template.projectId, mobileYear.id)) {
                    mobileYear.isdeprecated = true;
                }
            })
        })

        //step2: go though template tree, pick tree node which has no-deprecated mobile year.
        var results = [];
        templates.map(function(template) {
            var mobileYears = template.mobileYears.filter(function(mobileYear){
                if(mobileYear.isdeprecated)
                    return false;
                return true;
            })

            debugger; //is continue works as expected? or return true?
            if(!mobileYears.length)
                return false; 


            var node = {
                projectId: template.projectId,
                label: template.label,
                mobileYears: mobileYears,
            }
            results.push(node);
        });

        console.log('=========== test filter projects template =========');
        console.log(JSON.stringify(results));

        return results;
    },

    componentDidMount: function() {
        API.getData().then(
            (function(param) {
                var isLoading = false;
                var projectList = param.projects;
                var projectTemplateList = this.getProjectTemplateList(projectList, param.allprojects);

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
                        <CTimeLine data={this.state.projectList}/>
                        <div className='leftContainer'>
                            <SubProjectList/>
                            <TaskList/>
                        </div>
                        <TaskDetail/>
                        <CreateProjectPopup data={this.state.projectTemplateList}/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
