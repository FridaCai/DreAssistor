import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/ui/index.js';
//import StaticalAssistorPopup from './statical_assistor_popup/index.js';
//import PeopleAssistorPopup from './people_assistor_popup/index.js';
import ContextMenu from './contextmenu.jsx';
import MessageBox from 'MessageBox';

import Util from 'Util';
import Task from './data/task.js';
import Project from './data/project.js';

import Request from 'Request';
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
            Request.getData(Request.getBackendAPI('project')),
            //Request.getData(Request.getMockupAPI('get_users.json'))
        ]).then((function(param){
            var projectsResponse = param[0];
            //var usersResponse = param[1];

            if(projectsResponse.errCode == -1){
                API.setProjects(projectsResponse.projects);    
            }
            
            /*if(usersResponse.errCode == -1){
                API.setUsers(usersResponse.users);
            }*/
            this.forceUpdate();
        }).bind(this)).catch(function(e){
            console.error(e.stack);
        });
    },

    componentWillUnmount: function(){
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
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            return;
        }

        var creator = SuperAPI.getLoginUser();



        var templateTask = API.getTemplateTasks().find(param.templateTaskId);

        var taskObj = {   
            template:templateTask.template,
            startTime: param.startTime,
            endTime: param.endTime,
            creatorId: creator.id,
            label: templateTask.label,
        };
        var task = new Task();
        task.init(taskObj);

        var row = param.row;
        var subproject = param.project.findChildByIndex(row);
        subproject.addChild(task);
        this.forceUpdate();
    },

    onTaskPopupShow: function(e, param){
        var result = ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<TaskPopup title={param.title} task={param.task} onOK={param.onOK}/>, this.refs.popup);  
    },

    onProjectPopupShow: function(e, param){
        if(!SuperAPI.isLogin()){
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            return;
        }

        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<ProjectPopup title={param.title} project={param.project} onOK={param.onOK}/>, this.refs.popup);  
    },
    
    onPropertyAssistorShow:function(){return;
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<StaticalAssistorPopup title={'统计助手'}/>, this.refs.popup);   
    },
    
    onPeopleAssistorShow:function(){return;
        ReactDOM.unmountComponentAtNode(this.refs.popup);
        ReactDOM.render(<PeopleAssistorPopup title={'前辈助手'}/>, this.refs.popup);
    },

    onAddProjectPopupShow: function(e){
        this.onProjectPopupShow(e, {
            title: '添加项目', 
            onOK: function(project){
                API.getProjects().add(project);
                API.signal_page_refresh.dispatch();                
            }
        })
    },

    render: function() {
        try{
            return (
                <div className='pageTask'>
                    <TemplateTaskList/>

                    <div className="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" className="btn btn-default" onClick={this.onAddProjectPopupShow}>添加项目</button> 
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
                    <div ref='popup' className='popup'></div>
                </div>
            );  
        }catch(e){
            console.error(e.stack);
        }
    }
});

module.exports = PageTask;
