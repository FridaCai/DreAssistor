import {Base} from 'Table';
import TaskData from '../../data/task.js';
import {Cell} from 'Table';
import Util from '../../../widget/excel/util.js';

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
		this.sheetName = `豆豆`;
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