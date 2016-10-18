import Projects from '../data/projects';
import Task from '../data/task';
import Signal from 'Signal';
import GloabalAPI from '../api.js';

import TCDM from './data/table';
import ValueTableUIData from './uidata/table_value';
import CurveTableUIData from './uidata_curve/curve';

import Request from 'Request';

import Curves from './data_curve/curves';
import TemplateTasks from '../data/templatetasks.js';


var API = {

	signal_treeNode_click: new Signal(),
	signal_table_refresh: new Signal(),

	_projects: undefined,

	setProjects: function(obj){
		this._projects = Projects.create(obj);
	},

	getProjects: function(){
		return this._projects;
	},


	getTaskIdByProjectId: function(projectId){
		var tasks = this._projects.findProject(projectId).findTasks();
		return tasks.map(function(task){
			return task.id;
		});
	},
	getAllTaskId: function(){
		var tasks = this._projects.findTasks();

		return tasks.map(function(task){
			return task.id;
		});
	},
	getTaskStatus: function(taskObj){
		var task = Task.create(taskObj);
		if(task.template.type != 2)
			return; //only for hotissue.

		var sheet = task.template.sheets[0];
		var propertyKeys = [
			'PROJECT.TASK.HOTISSUE.ROOT_CAUSE',
			'PROJECT.TASK.HOTISSUE.SOLUTION',
			'PROJECT.TASK.HOTISSUE.EXECUTE',
			'PROJECT.TASK.HOTISSUE.FEEDBACK'
		];

		var scores = propertyKeys.map(function(key){
			var property = sheet.findSingleParamByKey(key);
			return property.status ? 1:0;
		});

		var sum = 0;
		scores.map(function(score){
			sum += score;
		});

		return sum/4;
	},



	/*
		dm for table value.
	*/

	_tcDM: TCDM.create(),
	getTCDM: function(){
		return this._tcDM;
	},


	/*
		uidata for table value
	*/
	_valueTableUIData: new ValueTableUIData(),
	getValueTableUIData: function(){
		return this._valueTableUIData;
	},


























	/*
		dm for table curve.
	*/
	_curveDM: new Curves(),
	getCurveDM: function(){
		return this._curveDM;
	},

	/*
		uidata for table curve.
	*/
	_curveTableUIData: new CurveTableUIData(),
	setCurveTableUIData: function(value){
		this._curveTableUIData = value;
	},
	getCurveTableUIData: function(){
		return this._curveTableUIData;
	},



	/*
		update dm.
	*/
	dragNewCurve: function(curve){
		this._curveDM.add(curve);
	},

	dm2ui_curve: function(){
		this._curveTableUIData.dm2ui(this._curveDM);
	},

	curveDelete: function(index){
		this._curveDM.deleteAt(index);
	},





















	dm2ui: function(){
		this._valueTableUIData.dm2ui(this._tcDM);
	},
	ui2dm: function(){
		this._valueTableUIData.ui2dm(this._tcDM);	
	},
	appendNewTableLine: function(){
		this._tcDM.sheets[0].appendLine();
	},
	deleteAt: function(index){
		this._tcDM.sheets[0].deleteAt(index);		
	},
	clearTable: function(){
		this._tcDM.reset();	
	},
	move: function(startIndex, endIndex){
		this._tcDM.sheets[0].move(startIndex, endIndex);
	},

	loadCurve: function(id){
		var url = Request.getBackendAPI(`curve/${id}`);
		return Request.getData(url).then(function(result){
			return result;
		})
	},










	/*start of testing code*/
    _templateTasks: new TemplateTasks(),
    setTemplateTasks: function(value){
        this._templateTasks = new TemplateTasks();
        this._templateTasks.init(value);
    },
    getTemplateTasks: function(){
        return this._templateTasks;
    },

    findTemplateByType: function(type){
        return this._templateTasks.findById(type);
    },
    getAllTemplateTaskTypes: function(){
        return this._templateTasks.map(function(templatetask){
            return {
                id: templatetask.template.type,
                label: templatetask.label,
            }
        })
    },
	/*end of testing code*/
}

window.statical={
	tcdm: API._tcDM,
	treedm: API.getProjects(),
	valueTableUIData: API._valueTableUIData,
	curveTableUIData: API._curveTableUIData
}
module.exports = API;
