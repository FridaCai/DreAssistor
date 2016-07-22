import Base from './base.js';
import TaskData from '../../data/task.js';
import {Cell} from '../../../widget/excel/util.js';
import {Util} from '../../../widget/excel/util.js';

module.exports = class Task extends Base {
	constructor(){
		super()

		this.header = [
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),

			Cell.create({v: 'Label'}), 

			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			
			Cell.create({v: 'Start Week'}), 
			Cell.create({v: 'End Week'})
		];
		this.sheetName = `task`;
	}

	xls2ui(params, datamode){ //0--replace; 1--append
		//add;
		//append;
		//extend to base.js???

		if(datamode === 0){
			this.ui = [];
			this.header = [];
		}
			

		params.map((function(param){
			var ui = Util.excel2ui(param.sheet);
			ui.splice(0,1);
			this.ui = this.ui.concat(ui);
		}).bind(this));
	}

	ui2dm(project){
		project.clearTasks();
		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];

			var label = line[2].v;
			var startWeek = parseInt(line[8].v);
			var endWeek = parseInt(line[9].v);

			var task = new TaskData();
			task.init({
				"label": label,
				"startWeek": startWeek,
				"endWeek": endWeek,
			})
			task.week2time(project.sorp);
			project.addTask(task);
		}
	}

	dm2ui(project){
		this.sheetName = `task`;

		var tasks = project.findTasks();
		this.ui = tasks.map((function(task){
			task.time2week(project.sorp);

			return [
				Cell.create({isHide: true}),
				Cell.create({isHide: true}),

				Cell.create({v: task.label}),

				Cell.create({isHide: true}),
				Cell.create({isHide: true}),
				Cell.create({isHide: true}),
				Cell.create({isHide: true}),
				Cell.create({isHide: true}),

				Cell.create({v: task.startWeek}),
				Cell.create({v: task.endWeek})
			];
		}).bind(this)).reverse();
	}
}