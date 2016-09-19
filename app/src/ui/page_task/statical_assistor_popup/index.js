import DataTree from './datatree/index';
import MessageBox from 'MessageBox';
import './style.less';

var StaticalAssistorPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
        };
    },

	getContent: function() {
	    return (
			<DataTree className='datatree'/>					
	    );   
    },

	/*
	<div className='left'>
					<SearchPanel/>
					<DataTree/>					
				</div>
				<Table/>
				<Chart/>
	*/



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