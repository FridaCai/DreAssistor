import {Base} from 'Table';
class SearchPanelUIData extends Base{
	constructor(){
		super();
		this.sheetName = "";
	}
	

	ui2dm(dm){
		
	}
	dm2ui(dm){
		this.ui = [];
		/*
		dm: 
		{
			projects: [{
				id:
				label:

			}],
			tasks: [],
			engines: []
		}
		*/
		dm.projects.concat(dm.tasks).concat(dm.engines).map((function(entity){
			var {id, label} = entity;
			var type = (function(){
				if(entity instanceof Project){
					return '项目';
				}else if(entity instanceof Task){
					return '任务';
				}else if(entity instanceof Engine){
					return '发动机';
				}
			})();
			var hitStr = entity.getHitStr();

			this.ui.push(Line.create({cells: [Cell.create({
					component: Label,
					v: type
				}), Cell.create({
					component: Label,
					v: label
				}), Cell.create({
					component: Label,
					v: hitStr
				})]
			}));
		}).bind(this));
	}
}

module.exports = SearchPanelUIData;

