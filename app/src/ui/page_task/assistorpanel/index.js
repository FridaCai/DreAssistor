import API from '../api.js';

var AssistorPanel = React.createClass({
	getInitialState: function() {
        return {

        }
    },
    componentDidMount: function(){
        
    },
    componentDidUnMount: function(){
        
    },

    render: function() {
        return (
            <div className='assistorPanel'>
                <div className='teacherPanel'>
                    <ul className="nav nav-tabs">
                      <li role="presentation" className="active"><a href="#">前辈A</a></li>
                      <li role="presentation"><a href="#">前辈B</a></li>
                      <li role="presentation"><a href="#">前辈C</a></li>
                    </ul>

                </div>


                <div className='infoSearchPanel'>

                </div>
            </div>
        );    
    }
});

module.exports = AssistorPanel;
