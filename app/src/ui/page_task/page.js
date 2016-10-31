import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/ui/index.js';
import StaticalAssistorPopup from './statical_assistor_popup/ui/index.js';
import MessageBox from 'MessageBox';
import Util from 'Util';
import Task from 'data/task.js';
import Project from 'data/project.js';

import Request from 'Request';
import API from './api.js';

import RadioGroup from 'RadioGroup';
import Pagination from 'Pagination';
import Loading from 'Loading';

import  GlobalAPI from 'api.js';
import LoadingMask from 'LoadingMask';

var ProjectFilter = React.createClass({
    getInitialState(){
        return {
            onlyMe: this.props.onlyMe
        }
    },
    componentDidMount(){

    },
    componentWillUnmount(){

    },
    componentWillReceiveProps: function(newProp){
        this.setState({onlyMe: newProp.onlyMe});
    },
    render(){
        var self = this;
        var selectedId = this.state.onlyMe ? 1:0;


        var radioGroup = {
            id: `projectFilter`,
            selectedId: selectedId,
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
            }).bind(this)
        }


        return (<div style={{clear:'both'}}><RadioGroup ref='radiogroup' param={radioGroup}/></div>)
        
    }
})


var PageTask = React.createClass({
	getInitialState: function() {
        return {
            onlyMe: false,
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

        API.signal_popup_show.listen(this.onPopupShow);

        GlobalAPI.signal_login.listen(this.onLogIn);
        GlobalAPI.signal_logout.listen(this.onLogOut);
        this.refresh();
    },
    onLogIn: function(){
        this.refresh();
    },
    onLogOut: function(){
        this.setState({
            onlyMe: false
        }, this.refresh)
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

        API.signal_popup_show.unlisten(this.onPopupShow);

        GlobalAPI.signal_login.unlisten(this.refresh);
        GlobalAPI.signal_logout.unlisten(this.refresh);
    },
    onPopupShow: function(e, param){
        var msg = param.msg;
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
    },
    onTaskDelete: function(e, param){
        var  task = param.task;
        var url = Request.getBackendAPI(`task/${task.id}`);
        Request.deleteData(url).then((function(res){
            if(res.errCode === -1){
                this.refresh();    
            }
        }).bind(this), (function(e){
            throw e;
        }).bind(this)).catch(function(e){
            console.error(e.stack);
        });
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
        }).bind(this), (function(e){
            throw e;
        }).bind(this)).catch(function(e){
            switch(e.errCode){
                case 8:
                    GlobalAPI.signal_logout.dispatch();
                    var msg = `请重新登录`;
                    ReactDOM.unmountComponentAtNode(this.refs.popup);    
                    ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
                    break;
                case 10:
                    var msg = `没有操作权限`;
                    ReactDOM.unmountComponentAtNode(this.refs.popup);    
                    ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
                    break;
                default:
                    console.error(e.errMsg);
            }
        });
    },
    onProjectDelete: function(e, param){
        //show make sure message.
        //progressbar.
        var onOK = (function(){
            return new Promise((function(resolve, reject){
                this.refs.loadingMask.show();

                var  project = param.project;
                var url = Request.getBackendAPI(`project/${project.id}`);
                Request.deleteData(url).then((function(res){
                    if(res.errCode === -1){
                        this.refresh();    
                    }
                    this.refs.loadingMask.hide();
                }).bind(this), (function(e){
                    throw new Error();
                }).bind(this)).catch((function(e){
                    console.error(e.stack);

                    this.refs.loadingMask.hide();
                    var msg = '服务器故障';
                    ReactDOM.unmountComponentAtNode(this.refs.popup);    
                    ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
                }).bind(this));
                
                resolve();
            }).bind(this));   
        }).bind(this);

        var msg = `确定要删除？`;
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<MessageBox onOK={onOK} msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
    },
    onPageRefresh: function(e){
        this.refresh();
    },

    onTaskCreate: function(e, param){
        if(!GlobalAPI.isLogin()){
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            return;
        }

        var creator = GlobalAPI.getLoginUser();
        var templateTask = GlobalAPI.getTemplateTasks().findById(param.templateTaskId);

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
        var project = task.parent.parent; //for ref key.
        var projectId = project.id;
        var isReadOnly = param.isReadOnly;

        var queryTaskUrl = Request.getBackendAPI(`task/${taskId}`);
        var queryProjectUrl = Request.getBackendAPI(`project/${projectId}`);

        return Promise.all([
            Request.getData(queryTaskUrl), 
            Request.getData(queryProjectUrl)
        ]).then((function(){ //fail case.
            var taskRes = arguments[0][0];
            var projectRes = arguments[0][1];

            if(taskRes.errCode != -1 || projectRes.errCode != -1){
                return;
            }
            task.update(taskRes.task);
            project.update(projectRes.project);

            var result = ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<TaskPopup title={param.title} task={task} onOK={param.onOK} isReadOnly={isReadOnly}/>, this.refs.popup);  
        }).bind(this), function(err){
            throw err;
        }).catch(function(err){
            console.error(err.stack);
        });
    },

    onProjectPopupShow: function(e, param){
        if(!GlobalAPI.isLogin() && !param.isReadOnly){
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            return;
        }

        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<ProjectPopup isReadOnly={param.isReadOnly} title={param.title} project={param.project} onOK={param.onOK}/>, this.refs.popup);  
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
                var creator = GlobalAPI.getLoginUser();
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
        if(!GlobalAPI.isLogin() && onlyMe){
            ReactDOM.unmountComponentAtNode(this.refs.popup);    
            ReactDOM.render(<MessageBox msg={'请先登录'} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
            this.refs.projectfilter.setState({onlyMe:false});
            return;
        }



        API.clearProjects();
        API.pagination = {
            count: 0,
            limit: 10,
            offset: 0
        }
        this.setState({onlyMe: onlyMe}, this.refresh); //todo: set API.onlyMe.
    },

    refresh: function(onlyMe){
        if(onlyMe == undefined){
            onlyMe = this.state.onlyMe;
        }


        var {offset, limit} = API.pagination; 
        var param = {
            limit: limit,
            offset: offset * limit,
        }


        if(onlyMe){
            var loginUser = GlobalAPI.getLoginUser();
            if(loginUser){
                param.userId = loginUser.id;
            }
        }

        Request.getData(Request.getBackendAPI('project'), param)
            .then((function(result){
                if(result.errCode == -1){
                    API.setProjects(result.projects);   
                    API.pagination.count = result.count;
                    this.forceUpdate(this.clientRefresh);
                }
            }).bind(this),function(e){
                throw e
            }).catch(function(e){
                console.error(e.stack);
            });    
    },
    clientRefresh: function(){
        var w = $('body').width()-1;
        $('body').width(w);
    },
    onPagination:function(offset){
        API.clearProjects();
        this.forceUpdate((function(){
            API.pagination.offset = offset;
            this.refresh();    
        }).bind(this));

        
    },
    render: function() {
        var pageBody = (function(){
            var projects = API.getProjects();
            if(!projects){
                return (
                    <div className='loadingContainer'>
                        <Loading/>
                    </div>
                );
            }else{
                var dom = API.getProjects().map(function(project){
                    return (<CTimeLine project={project} key={project.id}/>)
                });
                var {limit, offset, count} = API.pagination;

                if(count!=0){
                    dom.push((<Pagination key='pagination'
                            curPage={offset}
                            totalPage={Math.ceil(count/limit)}
                            onPagination ={this.onPagination}/>));    
                }
                return dom;
            }
        }).call(this);

        try{
            return (
                <div className='pageTask'>
                    <TemplateTaskList/>

                    <div className="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" className="btn btn-default" onClick={this.onAddProjectPopupShow}>添加项目</button> 
                        <button type="button" className="btn btn-default" onClick={this.onStaticalAssistorPopupShow}>助手</button> 
                    </div> 

                    <ProjectFilter ref='projectfilter' onChange={this.onProjectFilterChange} onlyMe={this.state.onlyMe}/>
                    {pageBody}

                    <div ref='popup' className='popup'></div>
                    <LoadingMask ref='loadingMask'/>
                </div>
            );  
        }catch(e){
            console.error(e.stack);
        }
    }
});

module.exports = PageTask;
