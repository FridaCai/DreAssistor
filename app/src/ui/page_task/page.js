import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/index.js';
import StaticalAssistorPopup from './statical_assistor_popup/index.js';
import PeopleAssistorPopup from './people_assistor_popup/index.js';
import ContextMenu from './contextmenu.jsx';
import MessageBox from '../widget/messagebox.js';


import Util from '../../util.js';
import Task from './data/task.js';
import Project from './data/project.js';

import Request from '../../request.js';
import API from './api.js';
import SuperAPI from '../../api.js';

var PageTask = React.createClass({
	getInitialState: function() {
        return {
        }
    },

    onTaskCreate: function(e, param){
        if(!SuperAPI.isLogin()){
            this.refs.msgbox.show();
            return;
        }


        var templateTask = API.getTemplateTasks().find(param.templateTaskId);
        var creator = SuperAPI.getLoginUser();
        var taskObj = $.extend({}, templateTask);
        taskObj = $.extend(taskObj, {   
            id: Util.generateUUID(),
            startTime: param.startTime,
            endTime: param.endTime,
            creatorId: creator.id,
        });
        var task = new Task();
        task.init(taskObj);

        var row = param.row;
        var subproject = param.project.findChildByIndex(row);
        subproject.addChild(task);
        this.forceUpdate();
    },

    componentDidMount: function(){
        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_projectpoup_show.listen(this.onProjectShow);
        API.signal_timeline_task_create.listen(this.onTaskCreate);
        API.signal_timeline_contextmenu_show.listen(this.onContextMenuShow);
        API.signal_statical_assistor_popup_show.listen(this.onStaticalAssistorPopupShow);
        API.signal_people_assistor_popup_show.listen(this.onPeopleAssistorPopupShow);

        Promise.all([
            Request.getData(Request.getMockupAPI('get_projects.json')),
            Request.getData(Request.getMockupAPI('get_template_enum.json'))
        ]).then((function(param){
            var projectsResponse = param[0];
            var templateEnumResponse = param[1];

            if(projectsResponse.errCode == -1){
                API.setProjects(projectsResponse.projects);    
            }
            if(templateEnumResponse.errCode == -1){
                API.setTemplateEnum(templateEnumResponse.templateenum);       
            }
            this.forceUpdate();
        }).bind(this));
    },
    componentDidUnMount: function(){
        API.signal_taskpopup_show.unlisten(this.onTaskPopupShow);
        API.signal_page_refresh.unlisten(this.onPageRefresh);
        API.signal_projectpoup_show.unlisten(this.onProjectShow);
        API.signal_timeline_task_create.unlisten(this.onTaskCreate);
        API.signal_timeline_contextmenu_show.unlisten(this.onContextMenuShow);
        API.signal_statical_assistor_popup_show.unlisten(this.onStaticalAssistorPopupShow);
        API.signal_people_assistor_popup_show.unlisten(this.onPeopleAssistorPopupShow);
    },
    onPageRefresh: function(e){
        this.forceUpdate();
    },
    onTaskPopupShow: function(e, param){
        this.refs.taskpopup.show(param);
    },
    onProjectShow: function(e, param){
        this.refs.projectpopup.show(param);
    },
    onContextMenuShow: function(e, param) {
        this.refs.contextmenu.show(param);
    },
    onStaticalAssistorPopupShow: function(e, param){
        this.refs.staticalAssistorPopup.show(param);
    },
    onPeopleAssistorPopupShow: function(e, param){
        this.refs.peopleAssistorPopup.show(param);  
    },
    render: function() {
        return (
            <div className='pageTask'>
                <TemplateTaskList/>
                {
                    API.getProjectArr().map(function(project){
                        return (
                            <CTimeLine project={project} key={project.id}/>
                        )
                    })
                }
                <TaskPopup ref='taskpopup'/>
                <ProjectPopup ref='projectpopup'/>
                <ContextMenu ref='contextmenu'/>
                <PeopleAssistorPopup ref='peopleAssistorPopup'/>
                <StaticalAssistorPopup ref='staticalAssistorPopup'/>
                <MessageBox ref='msgbox' msg='请先登录' cName='msg_4_2'/>
            </div>
        );    
    }
});

module.exports = PageTask;
