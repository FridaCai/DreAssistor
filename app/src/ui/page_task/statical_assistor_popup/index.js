import DataTree from './datatree/index';
import MessageBox from 'MessageBox';
import Table from './table/index';
import API from './api';
import Request from 'Request';
import './style.less';

var StaticalAssistorPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
        };
    },

	getContent: function() {
	    return (
	    	<div className='staticalassistorpopup'>
	    		<div className='trees'>
	    			<DataTree ref='tree'/>	
					<DataTree ref='subtree'/>		    			
	    		</div>
				<div className='tableChart'>
					<Table/>
				</div>				
	    	</div>
	    );   
    },

    componentDidMount: function(){
    	//load data for tree.
    	//when tree is toggele, load data for subtree.

        Request.getData(Request.getBackendAPI('statical')).then((function(param){
        	if(param.errCode == -1){
        		API.setProjects(param.projects);
        	
        		var projects = API.getProjects();
	        	var treeData = API.convertProjects2TreeData(projects); //todo. 

				//todo: render tree according 2 tree data.
				//todo: bind dm for ui activity.
	        	this.refs.tree.setState({data: treeData});
        	}
        }).bind(this)).catch(function(e){
            console.error(e.stack);
        });
    },

	render() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox cName='staticalPopup' 
        	title={title} 
        	onOK={this.onOK} 
        	ref='msgbox' 
        	children={content} 
        	isShow={true}/>);
    },
})

module.exports = StaticalAssistorPopup;