import API from '../api.js';

var SubProjectList = React.createClass({
	getInitialState: function() {
        return {
        	project: this.props.project,
        }
    },
    componentDidMount: function() {
        
    },

    componentWillReceiveProps: function(newProps) {
		this.setState({
			project: newProps.project,
		});	
    },
	onShowCheckboxChange: function(subproject) {
		API.toggleSubprojectVisbility(subproject);
		API.signal_page_refresh.dispatch();
	},	
	onAdd: function(){
		API.signal_addSubProjectPopup_show.dispatch();
	},
	onSubProjectDeleteBtnClk: function() {
		//show popup;
	},




    render: function() {
    	var project = this.state.project;
    	var subprojects = project.children;


        return (<div className='subProjectList leftlist'>
	    	<div className="panel panel-default">
			  <div className="panel-heading">
				<span>时间包列表</span>
	            <span className='hearderBtns'>
	                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer'}} 
	                		onClick={this.onSort} className='sortBtn'>sort</span>
	                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} 
	                		onClick={this.onFilter} className='filterBtn'>filter</span>
	                <span style={{padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} 
	                		onClick={this.onAdd} className='addBtn'>+</span>    
	            </span>
			  </div>
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

			  						<td>
			  							<span style={{float: 'right', padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} 
              								onClick={this.onSubProjectDeleteBtnClk.bind(this, subproject)}>-</span>
          								<span style={{float: 'right', padding: '2px 5px', background:'#ccc', cursor:'pointer', marginLeft:'10px'}} 
              								onClick={this.onSubProjectEditBtnClk.bind(this, subproject)}>E</span>
      								</td>
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