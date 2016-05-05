import React from 'react';

var TaskList = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentDidMount: function() {
        
    },
    render: function() {
        return (<div className='taskList leftlist'>
	    	<div className="panel panel-default">
			  <div className="panel-heading">时间包列表</div>
			  <table className="table">
			  	<thead> 
			  		<tr> 
			  			<th>选择</th> 
			  			<th>时间包名</th> 
			  			<th>创建者</th> 
		  			</tr> 
	  			</thead> 
	  			<tbody> 
	  				<tr> 
	  					<td><input type='checkbox'/></td> 
  						<td>Otto</td> 
  						<td>@mdo</td> 
					</tr> 
					<tr> 
						<td><input type='checkbox'/></td> 
						<td>Thornton</td> 
						<td>@fat</td>
					</tr> 
				</tbody>
			  </table>
			</div>
		</div>);
    }
});

module.exports = TaskList;