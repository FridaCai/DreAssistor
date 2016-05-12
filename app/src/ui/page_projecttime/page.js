import React from 'react';
import CTimeLine from './view/timeline.js';
import SubProjectList from './view/list_subproject.js';
import TaskDetail from './view/panel_taskdetail.js';
import TaskList from './view/list_task.js';
import API from './api.js';
import CreateProjectPopup from './view/popup_createproject.js';
import CreateSubProjectPopup from './view/popup_createsubproject.js';
import './page.less';
import MessageBox from '../widget/messagebox.js';

var PageProjectTime = React.createClass({
	getInitialState: function() {
        return {
            isLoading: true,
        }
    },

    onProjectsAdd: function(event, param) {
        API.addProjects(param.projects);
        this.forceUpdate();
    },

   onMessageBoxShow: function(event, param) {
        param = Object.assign({isShow: true}, param);
        this.refs.messagebox.setState(param);
    },

    onPageRefresh: function(event, param) {
        if(param)
            this.setState(param);
        else
            this.forceUpdate();
    },

    onAddProjectPopupShow: function(event, param) {
        this.refs.createprojectpopup.show();
    },
    onAddSubProjectPopupShow: function(event, param) {
        this.refs.createsubprojectpopup.show({
            selectedProject: API.getSelectedProject()
        });
    },



    onProjectSelectChange: function(event, param) {
        //todo: update subproject
        var project = API.findProject(param.projectId, param.mobileYearId);
        API.setSelectedProject(project);
        this.refs.subprojectlist.setState({project: API.getSelectedProject()})
    },





    componentDidMount: function() {
        API.signal_appProjectPopup_show.listen(this.onAddProjectPopupShow);
        API.signal_addSubProjectPopup_show.listen(this.onAddSubProjectPopupShow)


        API.signal_projects_add.listen(this.onProjectsAdd);
        API.signal_msgbox_show.listen(this. onMessageBoxShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        
        API.signal_project_selectchange.listen(this.onProjectSelectChange);

        API.getData().then(
            (function(param) {
                var isLoading = false;
                API.setProjects(param.projects);
                API.setProjectTemplates(param.projectTemplates);
                API.setPeople(param.people);

                API.initSelectedProject();

                this.setState({
                    isLoading: false,
                })
            }).bind(this)
        );
    },

    componentDidUnMount: function() {
        API.signal_projects_add.unlisten(this.onProjectsAdd);
        API.signal_msgbox_show.unlisten(this.onProjectDelete);
        API.signal_page_refresh.unlisten(this.onPageRefresh);
        API.signal_appProjectPopup_show.unlisten(this.onAddProjectPopupShow);
        API.signal_project_selectchange.unlisten(this.onProjectSelectChange);
    },


    render: function() {
        if(this.state.isLoading) {
            return (<div>Loading...</div>);
        }else{
            return (
                <div className='pageProjectTime'>
                    <CTimeLine/>
                    <div className='leftContainer'>
                        <SubProjectList ref='subprojectlist' project={API.getSelectedProject()}/>
                        <TaskList/>
                    </div>
                    <TaskDetail/>
                    <MessageBox ref='messagebox'/>
                    <CreateProjectPopup ref='createprojectpopup'/>
                    <CreateSubProjectPopup ref='createsubprojectpopup' 
                        projects = {API.getProjects()}
                        people = {API.getPeople()}
                        selectedProject={API.getSelectedProject()}
                        creator = {API.getCreator()}/>
                </div>
            );    
        }
    }
});

module.exports = PageProjectTime;
