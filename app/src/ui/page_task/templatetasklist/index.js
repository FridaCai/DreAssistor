import moment from 'moment';
import API from '../api.js';
import TemplateTask from '../data/templatetask.js';
import Request from '../../../request.js';
import Util from 'Util';
import MessageBox from 'MessageBox';
import TemplateTasks from '../../../config/get_template_tasks';
import './style.less';

var TemplateTaskList = React.createClass({
	getInitialState: function() {
        return {
        	tasks: [],
        }
    },
    onAddTaskBtnClk: function(){
        this.refs.msgbox.show({});
    },

    onEditTaskClk: function(task){
        return;
        API.signal_taskpopup_show.dispatch({
            title: '编辑豆豆',
            task: task,
            onOK: (function(){
                this.forceUpdate();
            }).bind(this),
        });
    },

    componentDidMount: function(){
        
    },



    // to get IE to work
    /*onDragEnter: function (e) {
        console.log('onDragEnter');
        return false;
    },*/




    onDragOver: function(e){
        e.preventDefault(); // allows us to drop
        //console.log('onDragOver');
        //return;

        
       // this.className = 'over';
       // e.dataTransfer.dropEffect = 'copy';
        //return false;
    },
    onDragStart: function(task, e){
        e.dataTransfer.setData("text", task.template.type.toString());
        //e.dataTransfer.effectAllowed = "move";
    },
   
    render: function() {
        //todo: template task both used in timeline page and statical page.
        //load data not only in timeline page.
        
        var tasks = TemplateTasks;
        API.setTemplateTasks(tasks); 
        

        var templateenum = tasks.map(function(task){
            return {id: task.id, label: task.label}
        });
        API.setTemplateEnum(templateenum);
        //<MessageBox ref='msgbox' msg='想添加新的豆豆模版？请将需求描述提交给开发人员：525311175@qq.com.'/>
        return (
            <div className='taskList'>
                
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>
                    {
                        API.getTemplateTasks().map((function(task){
                            var id = task.id;
                            var label = task.label;
                            var style = {
                                backgroundColor: Util.convertIntColorToHex(task.markColor),
                            }
                            return (
                                <a href='javascript:void(0);' draggable='true' className='task' style={style} key={id}
                                            onDragOver={this.onDragOver}
                                            onDragEnter={this.onDragEnter}
                                            onDragStart={this.onDragStart.bind(this, task)}
                                            onClick={this.onEditTaskClk.bind(this, task)}>
                                    {label}
                                </a>
                            )
                        }).bind(this))
                    }
            </div>
        );    
    }
});

module.exports = TemplateTaskList;

