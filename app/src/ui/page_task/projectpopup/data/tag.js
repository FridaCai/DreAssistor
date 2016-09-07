import {Base} from 'Table';
import DataTag from '../../data/tag.js';
import {Cell} from 'Table'; 
import {Line} from 'Table'; 
import {ExcelUtil} from 'XlsIExport';
import Signal from '../../../../signal.js';
import Label from 'Label';
import Input from 'Input';

class Tag extends Base {
	constructor(){
		super()
		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: 'Week'}), 
				Cell.create({component: Label, v: 'Date (Sorp-Week)'}), 
				Cell.create({component: Label, v: 'Date (Adjusted)'}), 
				Cell.create({component: Label, v: 'Update Program Milestone'}), 
			]
		})
		this.sheetName = `Master timing`;
	}

	ui2dm(project){
		project.clearTags();

		for(var i=0; i<this.ui.length; i++){
			var cells = this.ui[i].cells;
	        
	        var label = cells[3].v;
            var week = parseInt(cells[0].v);
            var time = cells[2].v ? ExcelUtil.convertYYYYMMDD2UnixTime(cells[2].v) : undefined;

            if(label){
            	var tag = new DataTag();
            	tag.init({
	                "label": label,
	                "week": week,
	                "time": time, 
	            });
            	project.addTag(tag); 
            } 
		}
	}
	
	dump(){
		var obj = [];

		this.ui.map(function(line){
			var lineObj = [];
			line.map(function(cell){
				lineObj.push(JSON.stringify(cell.dump(), '', 2));
			})
			obj.push(lineObj)
		})

		console.table(obj);
	}
	dm2ui(project){
		this.ui = [];
		

		var tags = project.getTags(function(tag1, tag2){
			return tag2.week - tag1.week;
		});

        var findByWeek = function(targets, week) { //can be task or tag.
            return targets.find(function(target){
                return target.week === week;
            })
        }


		var loop = tags[0].week;
		for(var i=loop; i>=0; i--){
            var tag = findByWeek(tags, i);
            var autoTime = ExcelUtil.convertUnixTime2YYYYMMDD(ExcelUtil.getTimeBySorpWeek(project.sorp, i));
            var line = Line.create({cells: [
        		Cell.create({component: Label, v: i}), 
            	Cell.create({component: Label, v:autoTime}), 
				Cell.create({component: Label, v: ''}),
        		Cell.create({component: Label, v:''})
        	]});
            	
            
            if(tag){
            	var adjustTime = ExcelUtil.convertUnixTime2YYYYMMDD(tag.time);

				line.cells[2] = Cell.create({component: Input, param: {
					onChange: function(v){
	        			this.v = v;
					}, 
					onBlur: function(){
	        			Tag.signal_adjusttime_blur.dispatch();
	        		},
		        	value: adjustTime,
				}, v: adjustTime});

                line.cells[3] = Cell.create({component: Label, v: tag.label});
            }
            this.ui.push(line);
        }
	}
}

Tag.signal_adjusttime_change = new Signal();
Tag.signal_adjusttime_blur = new Signal();

module.exports = Tag;
