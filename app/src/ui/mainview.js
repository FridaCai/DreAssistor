import Menu from './menu.js';
import Page from './page.js';
import RegisterPopup from './membership/registerpopup.js';
import API from "../api.js";

import UploadExcelComponent from './widget/excel/index.js';

var MainView = React.createClass({
	getInitialState: function() {
        return {
            
        }
    },
    componentDidMount: function(){
        API.signal_registerpopup_show.listen(this.showRegisterPopup);
        API.sigal_loginHeader_update.listen(this.updateLoginHeader);
    },
    componentDidUnMount: function(){
        API.signal_registerpopup_show.unlisten(this.showRegisterPopup); 
        API.sigal_loginHeader_update.unlisten(this.updateLoginHeader);
    },
    updateLoginHeader: function(){
        this.refs.menu.forceUpdate();
    },
    showRegisterPopup: function(){
        this.refs.registerpopup.show();
    },
    render: function() {
    	return (
    		<div>
				<Menu ref='menu'/>
				<Page/>
                <RegisterPopup ref='registerpopup'/>
                <UploadExcelComponent/>
    		</div>
		);
    }
});

module.exports = MainView;

