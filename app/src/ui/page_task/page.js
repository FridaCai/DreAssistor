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

    componentDidMount: function(){
        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_timeline_task_create.listen(this.onTaskCreate);
        API.signal_projectpoup_show.listen(this.onProjectPopupShow);

        Promise.all([
            Request.getData(Request.getMockupAPI('get_projects.json')),
            Request.getData(Request.getMockupAPI('get_template_enum.json')),
            Request.getData(Request.getMockupAPI('get_users.json'))
        ]).then((function(param){
            var projectsResponse = param[0];
            var templateEnumResponse = param[1];
            var usersResponse = param[2];

            if(projectsResponse.errCode == -1){
                API.setProjects(projectsResponse.projects);    
            }
            if(templateEnumResponse.errCode == -1){
                API.setTemplateEnum(templateEnumResponse.templateenum);       
            }
            if(usersResponse.errCode == -1){
                API.setUsers(usersResponse.users);
            }
            this.forceUpdate();
        }).bind(this));
    },

    componentDidUnMount: function(){
        API.signal_taskpopup_show.unlisten(this.onTaskPopupShow);
        API.signal_page_refresh.unlisten(this.onPageRefresh);
        API.signal_timeline_task_create.unlisten(this.onTaskCreate);
        API.signal_projectpoup_show.unlisten(this.onProjectPopupShow);
    },

    onPageRefresh: function(e){
        this.forceUpdate();
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

    onTaskPopupShow: function(e, param){
        this.refs.taskpopup.show(param);
    },

    onProjectPopupShow: function(e, param){
        this.refs.projectpopup.show({
            title: '添加项目',
        });
    },
    
    onPropertyAssistorShow:function(){
        this.refs.staticalAssistorPopup.show({
            title: '统计助手',
        });
    },
    
    onPeopleAssistorShow:function(){
        this.refs.peopleAssistorPopup.show({
            title: '前辈助手',
        });  
    },
    
    render: function() {
        //todo: create popup when needed. otherwise, avoid loading data for the not necessary rendering.
        return (
            <div className='pageTask'>
                <TemplateTaskList/>

                <div className="btn-group" role="group" aria-label="Basic example"> 
                    <button type="button" className="btn btn-default" onClick={this.onProjectPopupShow}>添加项目</button> 
                    <button type="button" className="btn btn-default" onClick={this.onPropertyAssistorShow}>查看属性助手</button> 
                    <button type="button" className="btn btn-default" onClick={this.onPeopleAssistorShow}>查看前辈助手</button> 
                </div> 


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
