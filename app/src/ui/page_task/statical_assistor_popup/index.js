import './style.less';
import MessageBox from 'MessageBox';

import Content from './page';
var StaticalAssistorPopup = React.createClass({
    getInitialState: function() {
        return {
            title: this.props.title,
        };        
    },

	getContent(){
        return (<Content/>);
    },
	render() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox cName='staticalPopup' 
        	title={title} 
        	onOK={this.onOK} 
        	ref='msgbox' 
        	children={content} 
        	isShow={true}
            hideFooter={true}/>);
    },
})

module.exports = StaticalAssistorPopup;