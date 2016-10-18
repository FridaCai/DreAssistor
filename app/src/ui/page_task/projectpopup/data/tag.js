import {Base} from 'Table';
import DataTag from '../../data/tag.js';
import {Cell} from 'Table'; 
import {Line} from 'Table'; 
import {ExcelUtil} from 'XlsIExport';
import Signal from '../../../../signal.js';
import Label from 'Label';
import Input from 'Input';
import Time from 'Time';

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
			var line = this.ui[i];
	        
	        var label = line.getCellAt(3).getValue();
            var week = parseInt(line.getCellAt(0).getValue());
            var time = line.getCellAt(2).getValue();

            if(label){
            	var tag = new DataTag();
            	tag.init({
            		"id": line.id,
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
            
            var line;
            if(tag){
            	//var adjustTime = ExcelUtil.convertUnixTime2YYYYMMDD(tag.time);
            	var adjustTime = tag.time;

				line = Line.create(		
	            	{
	            		id: tag.id,
	            		cells: [
			        		Cell.create({component: Label, v: i}), 
			            	Cell.create({component: Label, v:autoTime}), 
							Cell.create({
			        			component: Time,
			        			param: {
			        				value: adjustTime,
			        				onChange: function(v){
			        					this.v = v;
			        				}
			        			},
			        			v: adjustTime
			        		}),
			        		Cell.create({component: Label, v: tag.label})
			        	]
			        }
	        	);
            }else{
            	var line = Line.create(
	            	{
	            		cells: [
			        		Cell.create({component: Label, v: i}), 
			            	Cell.create({component: Label, v:autoTime}), 
							Cell.create({component: Label, v: ''}),
			        		Cell.create({component: Label, v:''})
			        	]
			        }
	        	);
            }
            this.ui.push(line);
        }
	}
}

Tag.signal_adjusttime_change = new Signal(); //DEPRECATED?
Tag.signal_adjusttime_blur = new Signal(); //DEPRECATED?

module.exports = Tag;
