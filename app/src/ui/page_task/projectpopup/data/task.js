import Base from './base.js';
import TaskData from '../../data/task.js';
import {Cell} from '../../../widget/excel/util.js';
import {Util} from '../../../widget/excel/util.js';

module.exports = class Task extends Base {
	constructor(){
		super()
	}

	xls2ui(params, datamode){ //0--replace; 1--append
		if(datamode === 0)
			this.ui = [];

		params.map((function(param, index){
			var ui = Util.excel2ui(param.sheet);

			if(index !== 0){
				ui.splice(0,1); //remove the first line(header).
			}
			
			this.ui = this.ui.concat(ui);
		}).bind(this));
	}

	ui2dm(project){
		project.clearTasks();
		for(var i=1; i<this.ui.length; i++){
			var line = this.ui[i];

			var label = line[2].v;
			var startWeek = parseInt(line[8].v) * (-1);
			var endWeek = parseInt(line[9].v) * (-1);

			var task = new TaskData();
			task.init({
				"label": label,
				"startWeek": startWeek,
				"endWeek": endWeek,
			})
			project.addTask(task);
		}
	}

	dm2ui(project){
		this.sheetName = `task`;

		var tasks = project.findTasks();
		this.ui = tasks.map((function(task){
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

		this.ui.unshift([
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
		]);
	}
}