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
	

	dm2ui(project){
		this.ui = [];
		
		var tags = project.getTags(function(tag1, tag2){
			return tag2.week - tag1.week;
		});

        var findByWeek = function(targets, week) {
            return targets.find(function(target){
                return target.week === week;
            })
        }

		var loop = tags[0].week;
		for(var i=loop; i>=0; i--){
            var autoTime = ExcelUtil.convertUnixTime2YYYYMMDD(ExcelUtil.getTimeBySorpWeek(project.sorp, i));
            
            var tag = findByWeek(tags, i);
            var id = undefined;
            var adjustTime = undefined;
            var label = undefined;
            if(tag){
            	id = tag.id;
            	adjustTime = tag.time;
            	label = tag.label;
            }

			var line = Line.create({
        		id: id,
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
	        		Cell.create({
	        			component: Input, 
	        			param: {
	        				value: label,
	        				onChange: function(v){
	        					this.v = v;
	        				}
	        			}, 

	        			v: label
	        		})
	        	]
	        });
            this.ui.push(line);
        }
	}
}

Tag.signal_adjusttime_change = new Signal(); //DEPRECATED?
Tag.signal_adjusttime_blur = new Signal(); //DEPRECATED?

module.exports = Tag;
