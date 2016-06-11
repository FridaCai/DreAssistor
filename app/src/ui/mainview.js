import Menu from './menu.js';
import Page from './page.js';

var MainView = React.createClass({
	getInitialState: function() {
        return {
            
        }
    },
    render: function() {
    	return (
    		<div>
				<Menu/>
				<Page/>
    		</div>
    		

		);
    }
});

module.exports = MainView;

