import {Base} from 'Table';
import TaskData from 'data/task.js';
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
			var line = this.ui[i];
			var cells = line.cells;

			var id = line.id;
			var label = cells[2].v;
			var startWeek = Math.abs(parseInt(cells[8].v));
			var endWeek = Math.abs(parseInt(cells[9].v));

			var task = new TaskData();
			task.init({
				id: id,
				label: label,
				startWeek: startWeek,
				endWeek: endWeek,
				template: {
					type:0
				}
			})
			task.week2time(project.sorp);
			project.addTask(task);
		}
	}

	dm2ui(project){
		this.ui = [];
		project.tasks.map((function(task){
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
				],
				id: task.id
			}));
		}).bind(this));
		this.ui = this.ui.reverse();
	}
}