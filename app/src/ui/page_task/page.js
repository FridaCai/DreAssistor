import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/ui/index.js';
import StaticalAssistorPopup from './statical_assistor_popup/index.js';
//import PeopleAssistorPopup from './people_assistor_popup/index.js';
import ContextMenu from './contextmenu.jsx';
import MessageBox from 'MessageBox';

import Util from 'Util';
import Task from './data/task.js';
import Project from './data/project.js';

import Request from 'Request';
import API from './api.js';
import SuperAPI from '../../api.js';

import RadioGroup from 'RadioGroup';
import Pagination from 'Pagination';
import Loading from 'Loading';

var ProjectFilter = React.createClass({
    getInitialState(){
        return {
            selectedId: this.props.onlyMe ? 1:0,
        }
    },
    componentDidMount(){

    },
    componentWillUnmount(){

    },

    render(){
        var self = this;
        var radioGroup = {
            id: `projectFilter`,
            selectedId: this.state.selectedId,
            options: [{
                id: 0,
                label:"全部项目"
            },{
                id: 1,
                label: "只看自己的项目"
            }],
            onChange: (function(selectedId){
                var onlyMe = (selectedId == 0 ? false: true);
                self.props.onChange(onlyMe);

                self.setState({selectedId: selectedId});

            }).bind(this)
        }


        return (<div style={{clear:'both'}}><RadioGroup param={radioGroup}/></div>)
        
    }
})


var PageTask = React.createClass({
	getInitialState: function() {
        return {
            onlyMe: false
        }
    },

    componentDidMount: function(){
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_projectpopup_show.listen(this.onProjectPopupShow);
        API.signal_edit_project.listen(this.onProjectEdit);
        API.signal_delete_project.listen(this.onProjectDelete);

        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
        API.signal_timeline_task_create.listen(this.onTaskCreate);
        API.signal_edit_task.listen(this.onTaskEdit);
        API.signal_delete_task.listen(this.onTaskDelete);
        this.refresh();
    },

    componentWillUnmount: function(){
        API.signal_page_refresh.unlisten(this.onPageRefresh);
        API.signal_projectpopup_show.unlisten(this.onProjectPopupShow);
        API.signal_edit_project.unlisten(this.onProjectEdit);
        API.signal_delete_project.unlisten(this.onProjectDelete);

        API.signal_taskpopup_show.unlisten(this.onTaskPopupShow);
        API.signal_timeline_task_create.unlisten(this.onTaskCreate);
        API.signal_edit_task.unlisten(this.onTaskEdit);
        API.signal_delete_task.unlisten(this.onTaskDelete);
    },
    onTaskDelete: function(e, param){
        var  task = param.task;
        var url = Request.getBackendAPI(`task/${task.id}`);
        Request.deleteData(url).then((function(res){
            if(res.errCode === -1){
                this.refresh();    
            }
        }).bind(this));
    },
    onTaskEdit: function(e, param){
        var task = param.task;
        var projectId = task.parent.parent.id;
        var url = Request.getBackendAPI(`task/${task.id}`);
        var data = {
            projectId: projectId,
            task: task.dump(),
        }
        Request.putData(url, data).then((function(res){
            if(res.errCode === -1){
                this.refresh();    
            }
        }).bind(this));
    },
    onProjectEdit: function(e, param){
        var project = param.project;
        var url = Request.getBackendAPI(`project/${project.id}`);
        var data = project.dump();
        Request.putData(url, data).then((function(res){
            if(res.errCode === -1){
                this.refresh();    
            }
        }).bind(this));
    },
    onProjectDelete: function(e, param){
        var  project = param.project;
        var url = Request.getBackendAPI(`project/${project.id}`);
        Request.deleteData(url).then((function(res){
            if(res.errCode === -1){
                this.refresh();    
            }
        }).bind(this));
    },
    onPageRefresh: function(e){
        this.refresh();
    },

    onTaskCreate: function(e, param){
        if(!SuperAPI.isLogin()){
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            return;
        }

        var creator = SuperAPI.getLoginUser();
        var templateTask = API.getTemplateTasks().findById(param.templateTaskId);

        var task = Task.create({   
            template:templateTask.template,
            startTime: param.startTime,
            endTime: param.endTime,
            creatorId: creator.id,
            label: templateTask.label,
        });

        var projectId = param.project.id;

        var data = {
            projectId: projectId,
            task: task.dump()
        }


        var url = Request.getBackendAPI('task');
        return Request.postData(url, data).then((function(){ //fail case.
            this.refresh();
        }).bind(this), function(err){
            console.error(err);
        }).catch(function(err){
            console.error(err);
        });
    },

    onTaskPopupShow: function(e, param){
        var task = param.task;
        var taskId = param.task.id;

        var url = Request.getBackendAPI(`task/${taskId}`);
        return Request.getData(url).then((function(res){ //fail case.
            task.update(res.task);


            if(res.errCode === -1){
                var result = ReactDOM.unmountComponentAtNode(this.refs.popup);    
                ReactDOM.render(<TaskPopup title={param.title} task={task} onOK={param.onOK}/>, this.refs.popup);  
            }
        }).bind(this), function(err){
            console.error(err);
        });
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
    
    onStaticalAssistorPopupShow:function(){
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<StaticalAssistorPopup title={'助手'}/>, this.refs.popup);   
    },
    
    onPeopleAssistorShow:function(){return;
        ReactDOM.unmountComponentAtNode(this.refs.popup);
        ReactDOM.render(<PeopleAssistorPopup title={'前辈助手'}/>, this.refs.popup);
    },

    onAddProjectPopupShow: function(e){
        var self = this;
        this.onProjectPopupShow(e, {
            title: '添加项目', 
            onOK: function(project){
                var creator = SuperAPI.getLoginUser();
                project.setCreator(creator);

                var url = Request.getBackendAPI('project');
                var data = project.dump();
                var options = {
                   contentType: 'application/json; charset=UTF-8'
                };

                Request.postData(url, data, options).then(function(){
                    self.refresh();
                })
            }
        })
    },

    onProjectFilterChange: function(onlyMe){
        this.setState({onlyMe: onlyMe});
        this.refresh(onlyMe);
    },

    refresh: function(onlyMe){
        if(onlyMe == undefined){
            onlyMe = this.state.onlyMe;
        }


        var param = {
            limit: API.pagination.limit,
            offset: API.pagination.offset,
        }


        if(onlyMe){
            var loginUser = SuperAPI.getLoginUser();
            if(loginUser){
                param.userId = loginUser.id;
            }
        }

        Request.getData(Request.getBackendAPI('project'), param)
            .then((function(result){
                if(result.errCode == -1){
                    API.setProjects(result.projects);   
                    API.pagination.total = result.total;
                    this.forceUpdate();
                }
            }).bind(this),function(e){
                throw e
            }).catch(function(e){
                console.error(e);
            });    
    },
    onPagination:function(curpage){
        API.pagination.offset = curpage;
        this.refresh();
    },
    render: function() {
        var pageBody = (function(){
            var dom = [];

            var projects = API.getProjects();
            if(projects.length === 0){
                dom.push((
                    <div className='loadingContainer'>
                        <Loading/>
                    </div>
                ));
            }else{
                API.getProjects().map(function(project){
                    dom.push((
                        <CTimeLine project={project} key={project.id}/>
                    ))
                })
            }
            return dom;
        }).call(this);

        try{
            return (
                <div className='pageTask'>
                    <TemplateTaskList/>

                    <div className="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" className="btn btn-default" onClick={this.onAddProjectPopupShow}>添加项目</button> 
                        <button type="button" className="btn btn-default" onClick={this.onStaticalAssistorPopupShow}>助手</button> 
                    </div> 

                    <ProjectFilter onChange={this.onProjectFilterChange} onlyMe={this.state.onlyMe}/>
                    {pageBody}
                    <Pagination 
                        curPage={API.offset}
                        totalPage={Math.ceil(API.total/API.limit)}
                        onPagination ={this.onPagination}/> 
                    <div ref='popup' className='popup'></div>
                </div>
            );  
        }catch(e){
            console.error(e.stack);
        }
    }
});

module.exports = PageTask;
