import Base from './base.js';
import DataTag from '../../data/tag.js';
import {Cell} from '../../../widget/excel/util.js'; 
import {Util} from '../../../widget/excel/util.js';
import Signal from '../../../../signal.js';

class Tag extends Base {
	constructor(){
		super()
		this.header = [
			Cell.create({v: 'Week'}), 
			Cell.create({v: 'Date (Sorp-Week)'}), 
			Cell.create({v: 'Date (Adjusted)'}), 
			Cell.create({v: 'Update Program Milestone'})
		];
		this.sheetName = `Master timing`;
	}

	ui2dm(project){
		project.clearTags();

		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];
	        
	        var label = line[3].v;
            var week = parseInt(line[0].v);
            var time = line[2].v ? Util.convertYYYYMMDD2UnixTime(line[2].v) : undefined;


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
            var autoTime = Util.convertUnixTime2YYYYMMDD(Util.getTimeBySorpWeek(project.sorp, i));
            var line = [
            	Cell.create({v: i}), 
            	Cell.create({v:autoTime}), 
				Cell.create({v: ''}),
        		Cell.create({v:''})
    		];
            
            if(tag){
            	var adjustTime = Util.convertUnixTime2YYYYMMDD(tag.time);
                line[2] = Cell.create({
	            	id:'', 
	            	v: adjustTime,
	            	components:[{
		        		type: Cell.ComponentEnum.Input,
		        		onChange: function(e){
		        			var value = e.target.value;
		        			Tag.signal_adjusttime_change.dispatch({
		        				cell: this,
		        				value: value
		        			});
		        		},
		        		onBlur: function(){
		        			Tag.signal_adjusttime_blur.dispatch({
		        				cell: this,
		        			});
		        		},
		        	}]
                });
                line[3] = Cell.create({v:tag.label});
            }
            this.ui.push(line);
        }
	}
}

Tag.signal_adjusttime_change = new Signal();
Tag.signal_adjusttime_blur = new Signal();

module.exports = Tag;
