import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';

var TaskDetail = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentDidMount: function() {
        
    },

    render: function() {
    	var task = this.props.task; //refresh issue???


    	var getDom = function(){
    		if(task){
	  			var name = task.name;
		    	var startTime = task.startTime;
		    	var endTime = task.endTime;
		    	var desc = task.desc;
		    	var color = task.markColor;
		    	var attachedFiles = task.attachedFiles;
		    	var priority = task.priority;

	  			return (
	  				<div>
	  					<div className="taskDesc">
						  <label>任务描述</label>
	  					  <span>{desc}</span>
						</div>

						<div className="taskInfo">
							<div className="line">
							    <label>任务名称</label>
							    <span>{name}</span>
							</div>
						  	<div className="line">
							    <label>开始日期</label>
							    <span>{startTime}</span>
							</div>
							<div className="line">
							    <label>结束日期</label>
							    <span>{endTime}</span>
							</div>
							<div className="line">
							    <label>颜色</label>
								<span>{color}</span>
							</div>
						</div>

						<div className="attachedFiles">
							{attachedFiles}
						</div>
					</div>
				)
	  		}else{
	  			return null;
	  		}
    	}

        return (
        	<div className="taskDetail">
				<div className="panel panel-default">
					<div className="panel-heading">任务详情</div>
					<div className="panel-body">
					{
				  		getDom()
				  	}
					</div>
				  	
				</div>
			</div>
    	);
    }
});

module.exports = TaskDetail;