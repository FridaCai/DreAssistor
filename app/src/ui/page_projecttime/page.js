import CTimeLine from './view/timeline.js';
import SubProjectList from './view/list_subproject.js';
import TaskDetail from './view/panel_taskdetail.js';
import TaskList from './view/list_task.js';
import API from './api.js';
import CreateProjectPopup from './view/popup_createproject.js';
import SubProjectPopup from './view/popup_subproject.js';
import './page.less';
import MessageBox from '../widget/messagebox.js';
import Util from '../../util.js';

import SubProject from './data/subproject.js';

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
        var popupTitle = '添加时间包';
        var subprojectName = '';
        var projectList = API.getProjects();
        var projectSelectedKey = (function(){
            var p = API.getSelectedProject();
            var seperator = Util.SEPERATOR;
            var key = p.projectId + seperator + p.mobileYearId;
            return key;
        })();
        var peopleList = API.getPeople();
        var peopleSelectedList = [];

        this.refs.subprojectpopup.show({
            popupTitle: popupTitle,
            subprojectName: subprojectName, //for name input box.
            projectList: projectList, //for project dropdown 
            projectSelectedKey: projectSelectedKey, //for selected item in dropdown
            peopleList: peopleList, 
            peopleSelectedList: peopleSelectedList,

            onOKHandler: (function(param) {
                var project = param.project;
                var subproject = new SubProject();
                subproject.init({
                    id: Util.generateUUID(),
                    name: param.name,
                    tasks: [],
                    isShow: true,
                    creatorId: API.getLoginUser().id,
                    peopleIds: param.peopleIds,
                });

                API.addSubproject(project, subproject);
                this.forceUpdate();
            }).bind(this),
        });
    },

    onEditSubProjectPopupShow: function(event) {
        var selectedSubproject = API.getSelectedSubProject();  //todo: add selectedSupbroject to API follow selectedProject
        var popupTitle = '编辑时间包';
        var subprojectName = selectedSubproject.name;
        var projectList = API.getProjects();

        var oldProject = selectedSubproject.getParent();
        var projectSelectedKey = oldProject.projectId + Util.SEPERATOR + oldProject.mobileYearId;

        var peopleList = API.getPeople();
        var peopleSelectedList = selectedSubproject.peopleIds.map(function(id){
            return API.findPersonById(id);
        }); 

        this.refs.subprojectpopup.show({
            popupTitle: popupTitle,
            subprojectName: subprojectName, //for name input box.
            projectList: projectList, //for project dropdown 
            projectSelectedKey: projectSelectedKey, //for selected item in dropdown
            peopleList: peopleList, 
            peopleSelectedList: peopleSelectedList,

            onOKHandler: (function(param) {
                var newProject = param.project;
                var subproject = new SubProject();
                subproject.init({
                    id: selectedSubproject.id,
                    name: param.name,
                    tasks: [],
                    isShow: true,
                    creatorId: selectedSubproject.creatorId,
                    peopleIds: param.peopleIds,
                });
                API.editSubproject(subproject, oldProject, newProject);
                this.forceUpdate();
            }).bind(this),
        });
    },

    onProjectSelectChange: function(event, param) {
        var project = API.findProject(param.projectId, param.mobileYearId);
        API.setSelectedProject(project);
        this.refs.subprojectlist.setState({project: API.getSelectedProject()})
    },

    componentDidMount: function() {
        API.signal_appProjectPopup_show.listen(this.onAddProjectPopupShow);
        API.signal_projects_add.listen(this.onProjectsAdd);
        API.signal_msgbox_show.listen(this. onMessageBoxShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_project_selectchange.listen(this.onProjectSelectChange);
        API.signal_addSubProjectPopup_show.listen(this.onAddSubProjectPopupShow)
        API.signal_editSubProjectPopup_show.listen(this.onEditSubProjectPopupShow);

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
                    <SubProjectPopup ref='subprojectpopup'/>
                </div>
            );    
        }
    }
});

module.exports = PageProjectTime;
