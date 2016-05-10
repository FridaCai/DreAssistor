import React from 'react';
import CTimeLine from './view/timeline.js';
import SubProjectList from './view/list_subproject.js';
import TaskDetail from './view/panel_taskdetail.js';
import TaskList from './view/list_task.js';
import API from './api.js';
import CreateProjectPopup from './view/popup_createproject.js';
import MessageBox from '../widget/messagebox.js';
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

    onProjectsAdd: function(event, param) {
        API.addProjects(param.projects);
        this.setState({
            projects: API.getProjects(),
        })
    },

    onMessageBoxShow: function(event, param) {
        param = Object.assign({isShow: true}, param);
        this.refs.messageBox.setState(param);
    },

    onPageRefresh: function(event, param) {
        this.setState(param);
    },

    onAddProjectPopupShow: function(event, param) {
        this.refs.createprojectpopup.setState({
            isShow: true,
            selectedData: []
        });
    },
    componentDidMount: function() {
        API.signal_projects_add.listen(this.onProjectsAdd);
        API.signal_msgbox_show.listen(this. onMessageBoxShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_appProjectPopup_show.listen(this.onAddProjectPopupShow);

        API.getData().then(
            (function(param) {
                var isLoading = false;
                API.setProjects(param.projects);
                API.setProjectTemplates(param.allprojects);
                
                this.setState({
                    isLoading: false,
                    projects: param.projects,
                    projectTemplateList: param.projectTemplateList
                })
            }).bind(this)
        );
    },

    componentDidUnMount: function() {
        API.signal_projects_add.unlisten(this.onProjectsAdd);
        API.signal_msgbox_show.unlisten(this.onProjectDelete);
        API.signal_page_refresh.unlisten(this.onPageRefresh);
        API.signal_appProjectPopup_show.unlisten(this.onAddProjectPopupShow);
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
                        <CreateProjectPopup ref='createprojectpopup'/>
                        <MessageBox ref='messageBox'/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
