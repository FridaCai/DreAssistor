import API from '../api.js';
import PageProjectTime from './page_projecttime/page.js';

var PageView = React.createClass({
	getInitialState: function() {
        return {
            pageName: API.pageName,
        }
    },
    componentDidMount: function() {
        //todo: listen to menu event and set pageName state;
    },
    componentDidUnMount: function() {
        //todo: remove listener.
    },
    render: function() {
        switch(this.state.pageName) {
            case API.PAGE_NAMES.PROJECT_TIME: 
                return (<PageProjectTime/>);
                break;
            default: 
                return (<PageProjectTime/>);
        }
    	
    }
});

module.exports = PageView;