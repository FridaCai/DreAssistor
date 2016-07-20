import Base from './base.js';
import DataTag from '../../data/tag.js';
import {Cell} from '../../../widget/excel/util.js'; 
import {Util} from '../../../widget/excel/util.js';

module.exports = class Tag extends Base {
	constructor(){
		super()
	}
	ui2dm(project){
		project.clearTags();


		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];
	        
	        var label = line[3].v;
            var week = parseInt(line[0].v);
            var time = (function(sorp, week, adjustTime){
                var autoTime = Util.getTimeBySorpWeek(sorp, week);
                return adjustTime ? Util.convertYYYYMMDD2UnixTime(adjustTime): autoTime;
            }).call(this, project.sorp, week, line[2].v)

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
	dm2ui(project){
		this.sheetName = `tag`;

		this.ui = [[
			Cell.create({v: 'Week'}), 
			Cell.create({v: 'Date (Sorp-Week)'}), 
			Cell.create({v: 'Date (Adjusted)'}), 
			Cell.create({v: 'Update Program Milestone'})]
		];
		

		var tags = project.getTags(function(tag1, tag2){
			return tag2.week - tag1.week;
			//order by week desc
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
            	Cell.create({v:'', isEditable: true}), 
        		Cell.create({v:''}), 
    		];
            
            if(tag){
            	var adjustTime = Util.convertUnixTime2YYYYMMDD(tag.time);
                line[2] = Cell.create({v: adjustTime, isEditable:true});
                line[3] = {v: tag.label}
            }
            this.ui.push(line);
        }
	}
}
