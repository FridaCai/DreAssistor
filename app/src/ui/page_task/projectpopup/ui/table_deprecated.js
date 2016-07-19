import Util from '../../widget/excel/util.js';
import Request from '../../../request.js';
import moment from 'moment';
import SaveAs from 'browser-saveas';
import Project from '../data/project.js';
import SuperAPI from '../../../api.js';


var Table = React.createClass({


    ui2datamodel: function(ui){
        try{
            var project = new Project();
            var creator = SuperAPI.getLoginUser();
            var projectObj = {
                creatorId: creator.id,
                children: [{
                    "id": 0,
                    "label": "Master Timing",
                    "children": []
                },{
                    "id": 1,
                    "label": "AIS Development",
                    "children": []
                }]
            };

            //property sheet
            var propertyRaw = ui.sheets[this.PROPERTY_SHEETNAME];
            for(var i=1; i<propertyRaw.length; i++){
                var line = propertyRaw[i];
                var key = line[0].v;
                var value = line[1].v;

                switch(key){
                    case 'label':
                    case 'ec':
                        projectObj[key] = value;
                        break;
                    case 'bpmax':
                    case 'bpmin':
                        projectObj[key] = Math.round(parseFloat(value) * 100) / 100;
                        break;
                    case 'sorp':
                        projectObj.sorp = Util.convertYYYYMMDD2UnixTime(value);
                }
            }

       

            //tag sheet
            var taskInfoList = [];
            var tagRaw = ui.sheets[this.TAGS_SHEETNAME];
            for(var i=1; i<tagRaw.length; i++){
                var line = tagRaw[i];

                var label = line[3].v;
                var week = parseInt(line[0].v);

                var time = (function(sorp, week, adjustTime){
                    var autoTime = this.getTimeBySorpWeek(sorp, week);
                    return adjustTime ? Util.convertYYYYMMDD2UnixTime(adjustTime): autoTime;
                }).call(this, projectObj.sorp, week, line[2].v)


                var taskSheetName = this.getSheetName(line[4].v); //todo.
                label && projectObj.children[0].children.push({
                    "label": label,
                    "week": week,
                    "time": time, 
                    "class": "Tag",
                })


               if(taskSheetName){
                    var duration = line[5] ? parseFloat(line[5].v): 0;
                    var startTime = line[6] ? line[6].v: undefined;
                    var endTime = line[7] ? line[7].v: undefined;

                    taskInfoList.push({
                        sheetname: taskSheetName,
                        week: week,
                        duration: duration,
                        startTime: startTime,
                        endTime: endTime,
                    });
                }
            }

            taskInfoList.map((function(taskInfo){
                var taskObj = {};

                taskObj['spreadsheetName'] = taskInfo.sheetname;
                taskObj['week'] = taskInfo.week;
                taskObj['duration'] = taskInfo.duration;
                taskObj['startTime'] = taskInfo.startTime ? Util.convertYYYYMMDD2UnixTime(taskInfo.startTime): this.getTimeBySorpWeek(projectObj.sorp, taskInfo.week);
                taskObj['endTime'] = taskInfo.endTime ? Util.convertYYYYMMDD2UnixTime(taskInfo.endTime): this.getTimeBySorpWeek(projectObj.sorp, taskInfo.week - taskInfo.duration);
                taskObj["class"] = "Task";
                taskObj["creatorId"] = creator.id;

                var sheet = ui.sheets[taskInfo.sheetname];
                for(var i = 1; i<sheet.length; i++){
                    var key = sheet[i][0].v;
                    var value = sheet[i][1].v;
                    switch(key){
                        case 'label':
                        case 'desc':
                            taskObj[key] = value;
                            break;
                        case 'template':
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['type'] = parseInt(value);
                            break;
                        case 'snorkelNoiseXls':
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                            taskObj['template']['param']['snorkelNoiseXls'] = [value]; 
                            break;
                        case 'rootCause': 
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                            taskObj['template']['param']['rootCause'] = value; 
                            break;
                        case 'solution': 
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                            taskObj['template']['param']['solution'] = value; 
                            break;
                        case 'execute': 
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                            taskObj['template']['param']['execute'] = value; 
                            break;
                        case 'feedback': 
                            taskObj['template'] = taskObj['template'] || {};
                            taskObj['template']['param'] = taskObj['template']['param'] || {}; 
                            taskObj['template']['param']['feedback'] = value; 
                            break;
                    }
                }
                projectObj.children[1].children.push(taskObj);
            }).bind(this));

            project.init(projectObj);
            return project;
        }catch(e){
            console.error(e.stack);
        }
    },



    datamodel2ui: function(project){
        try{
            if(!project)
                return undefined;
        
            var sheetNames = [this.PROPERTY_SHEETNAME, this.TAGS_SHEETNAME];
            var sheets = {};

            //property sheet. //suppose only one line for table header.
            sheets[this.PROPERTY_SHEETNAME] = [
                [{v: 'property'}, {v:'value'}],
                [{v: 'label'}, {v: project['label']}],
                [{v: 'bpmax'}, {v: project['bpmax']}],
                [{v: 'bpmin'}, {v: project['bpmin']}],
                [{v: 'ec'}, {v: project['ec']}],
                [{v: 'sorp'}, {v:Util.convertUnixTime2YYYYMMDD(project['sorp']), isEditable:true, ref: 'sorp'}],
            ];


            //tags sheet.
            sheets[this.TAGS_SHEETNAME] = [[
                {v: 'Week'}, 
                {v: 'Date (Sorp-Week)'}, 
                {v: 'Date (Adjusted)'}, 
                {v: 'Update Program Milestone'},
                {v: 'Task'},
                {v: 'Task Duration (Week)'},
                {v: 'Task Start Time (Sorp-Week)'},
                {v: 'Task End Time (StartTime + Duration)'}
            ]];

            //precondition: tags are desc order.
            var tags = project.children[0].children;
            var tasks = project.findTasks();
            var loop = tags[0].week;


            var findByWeek = function(targets, week){ //can be task or tag.
                return targets.find(function(target){
                    return target.week === week;
                })
            }

            var taskList = [];
            for(var i=loop; i>=0; i--){
                var tag = findByWeek(tags, i);
                var autoTime = Util.convertUnixTime2YYYYMMDD(this.getTimeBySorpWeek(project.sorp, i));
                var line = [{v: i}, {v:autoTime}, {v:'', isEditable: true, ref: ''}, {v:''}, {v:''}, {v:''},{v:''}, {v:''}];
                
                if(tag){
                    line[2] = {v: Util.convertUnixTime2YYYYMMDD(tag.time), isEditable:true, ref: ''};
                    line[3] = {v: tag.label}
                }




            debugger; //find mutilple tasks for one tag.
                var findTask = (function(tasks, sorp, week){
                    return tasks.filter((function(task){
                        var startTime = task.startTime;
                        if(startTime){
                            var minTime = this.getTimeBySorpWeek(sorp, week);
                            var maxTime = this.getTimeBySorpWeek(sorp, week-1);
                            if(startTime >= minTime && startTime <maxTime)
                                return true  
                        }

                        if(task.week == week)
                            return true;

                        return false;
                    }).bind(this))
                }).bind(this);







                var task = findTask(tasks, project.sorp, i)[0];
                
                if(task){
                    
                    taskList.push(task);

                    line[4] = {v: `\$\{${task.spreadsheetName}\}`};
                    

                    var duration = (function(task){
                        if(task.endTime && task.startTime){
                            return (task.endTime - task.startTime) / (7 * 24* 3600 * 1000);
                        }else{
                            return task.duration;
                        }
                    })(task)

                    var startTime = (function(task){
                        if(task.startTime){
                            return task.startTime;
                        }

                        return this.getTimeBySorpWeek(project.sorp, task.week);
                    }).call(this, task);
                    

                    var endTime = (function(task){
                        if(task.endTime){
                            return task.endTime;
                        }

                        return this.getTimeBySorpWeek(project.sorp, task.week - task.duration);
                    }).call(this, task);

                    
                    line[5] = {v: Math.round(duration * 10) / 10};
                    line[6] = {v: Util.convertUnixTime2YYYYMMDD(startTime)};
                    line[7] = {v: Util.convertUnixTime2YYYYMMDD(endTime)};
                }
                sheets[this.TAGS_SHEETNAME].push(line);
            }

            


            //for auto_tasks, auto_task_0, auto_task_1...
            for(var i=0; i<taskList.length; i++){
                var task = taskList[i];

                var sheetName = task.spreadsheetName;
                sheetNames.push(sheetName);
                sheets[sheetName] = [
                    [{v: 'property'}, {v: 'value'}],
                    [{v: 'label'}, {v: task['label']}],
                    [{v: 'startTime'}, {v: Util.convertUnixTime2YYYYMMDD(task['startTime'])}],
                    [{v: 'endTime'}, {v: Util.convertUnixTime2YYYYMMDD(task['endTime'])}],
                    [{v: 'desc'}, {v: task['desc']}],
                    [{v: 'template'}, {v: task['template']['type']}],
                ];
                var TASK_TEMPLATE = {
                    NORMAL: 0,
                    EWO: 1,
                    HOTISSUE: 2,
                    MULE: 3
                }
                switch(task['template']['type']){
                    case TASK_TEMPLATE.MULE:
                        sheets[sheetName].push([{v: 'snorkelNoiseXls'}, {v: '${auto_snorkelNoiseXls}'}]);//todo: append snorkel noise sheet.
                        break;
                    case TASK_TEMPLATE.HOTISSUE: 
                        sheets[sheetName].push([{v: 'rootCause'}, {v: task['template']['param']['rootCause']}]);
                        sheets[sheetName].push([{v: 'solution'}, {v: task['template']['param']['solution']}]);
                        sheets[sheetName].push([{v: 'execute'}, {v: task['template']['param']['execute']}]);
                        sheets[sheetName].push([{v: 'feedback'}, {v: task['template']['param']['feedback']}]);
                        break;
                    case TASK_TEMPLATE.EWO:
                    case TASK_TEMPLATE.NORMAL:
                        break;
                }
            }
            return {sheetNames: sheetNames, sheets: sheets}
        }catch(e){
            console.error(e.stack);
        }
    },









    
    

	

    
})

