import API from '../api.js';

var SubProjectList = React.createClass({
	getInitialState: function() {
        return {
        	project: this.props.project,
        }
    },
    componentDidMount: function() {
        
    },

    componentWillReceiveProps: function() {

    },
	onShowCheckboxChange: function(subproject) {
		API.toggleSubprojectVisbility(subproject);
		API.signal_page_refresh.dispatch();
	},	
    render: function() {

    	var subprojects = this.state.project.children;


        return (<div className='subProjectList leftlist'>
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
	  				{
	  					subprojects.map(((subproject) => {
	  						return (
	  							<tr key={subproject.id}> 
				  					<td><input type='checkbox' checked={subproject.isShow} 
				  							onChange={this.onShowCheckboxChange.bind(this, subproject)}/></td> 
			  						<td>{subproject.name}</td> 
			  						<td>{subproject.creator}</td> 
								</tr> 
  							)
	  					}).bind(this))
	  				}
				</tbody>
			  </table>
			</div>
		</div>);
    }
});

module.exports = SubProjectList;