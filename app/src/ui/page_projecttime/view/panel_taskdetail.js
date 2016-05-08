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

    onStartTimeChange: function() {},
    onEndTimeChange: function() {},
    onColorChange:function(){},

    render: function() {
    	var desc = 'fdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfjfdaffjas;fjdasl;fjadsf;kjdaslfj';
    	var startTime = 1462250677000;
		var endTime = 1462250777000;

        return (
        	<div className="taskDetail">
				<div className="panel panel-default">
					<div className="panel-heading">任务详情</div>
					<div className="panel-body">
					  	<div className="taskDesc">
						  <label>任务描述</label>
	  					  <textarea defaultValue={desc}></textarea>
						</div>

						<div className="taskInfo">
							<div className="line">
							    <label>任务名称</label>
							    <input type="text"/>
							</div>
						  	<div className="line">
							    <label>开始日期</label>
							    <div className='datetime'>
									<Datetime/>
							    </div>
							</div>
							<div className="line">
							    <label>结束日期</label>
							    <div className='datetime'>
									<Datetime/>
							    </div>
							</div>
							<div className="line">
							    <label>颜色</label>
								<ColorPicker
							      animation="slide-up"
							      color={'#36c'}
							      onChange={this.onColorChange}/>
							</div>
						</div>

						<div className="attachedFiles">
						</div>
					</div>
				</div>
			</div>
    	);
    }
});

module.exports = TaskDetail;