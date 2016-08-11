import {Base} from 'Table';
import TaskData from '../../data/task.js';
import {Cell} from 'Table';
import {Line} from 'Table';
import Label from 'Label';

module.exports = class Task extends Base {
	constructor(){
		super()

		this.header = Line.create({cells: [
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),

			Cell.create({component: Label, v: 'Label'}), 
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({isHide: true}),
			Cell.create({component: Label, v: 'Start Week'}), 
			Cell.create({component: Label, v: 'End Week'})
		]})
		this.sheetName = `豆豆`;
	}

	ui2dm(project){
		project.clearTasks();
		for(var i=0; i<this.ui.length; i++){
			var cells = this.ui[i].cells;

			var label = cells[2].v;
			var startWeek = Math.abs(parseInt(cells[8].v));
			var endWeek = Math.abs(parseInt(cells[9].v));

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
		this.ui = [];
		tasks.map((function(task){
			task.time2week(project.sorp);

			this.ui.push(Line.create({
				cells: [
					Cell.create({isHide: true}),
					Cell.create({isHide: true}),
					Cell.create({component: Label, v: task.label}),
					Cell.create({isHide: true}),
					Cell.create({isHide: true}),
					Cell.create({isHide: true}),
					Cell.create({isHide: true}),
					Cell.create({isHide: true}),
					Cell.create({component: Label, v: task.startWeek}),
					Cell.create({component: Label, v: task.endWeek})
				]
			}));

		}).bind(this));
		this.ui = this.ui.reverse();
	}
}