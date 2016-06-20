import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';
import CDropDown from '../../widget/dropdown/dropdown.js';

var AssistorPopup = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    
    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateAfterMount);

        debugger;//what about templateTask???
        this.refs.msgbox.show();
    },

    updateAfterMount: function(){
        this.updateJqueryComponent();
        this.updateChart();
    },
    updateChart: function(){
        var data = {
          // A labels array that can contain any sort of values
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // Our series array that contains series objects or in this case series data arrays
          series: [
            [10, 2, 4, 2, 0]
          ]
        };

        var options = {
          width: 600,
          height: 400
        };


        // Create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. The Second parameter
        // is the actual data object.
        new Chartist.Line('.ct-chart', data, options);
    },
    updateJqueryComponent: function() {
        (function updateTypeDropdown(){
            var defaultKey = 0;
            var container = this.refs.typeDropdown;
            var options = [{
                id: 0,
                label:"全部"
            },{
                id: 1,
                label: "EWO"
            },{
                id: 2,
                label: "HotIssue"
            },{
                id: 3,
                label: 'Mule'
            }];
            
            var param = {
                id: "typeDropdown", //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
                onchange: (function(key){
                    
                }).bind(this),
            };
            this.typeDropdown = CDropDown.create(container, param);
        }).call(this);
    },
    onSearch: function(){

    },
    getContent: function() {
        return (
          <div className='assistorPopup'>
                <div className='teacherPanel'>
                    <ul className="nav nav-tabs">
                      <li role="presentation" className="active"><a href="#">前辈A</a></li>
                      <li role="presentation"><a href="#">前辈B</a></li>
                      <li role="presentation"><a href="#">前辈C</a></li>
                    </ul>
                </div>
                <div className='infoSearchPanel'>
                    <div className="line condition">
                        <label>类别</label>
                        <span ref='typeDropdown'></span>

                        <button className='btn btn-default searchBtn' 
                            onClick={this.onSearch}>
                            Search
                        </button>
                    </div>



                    <div className="panel panel-default">  
                        <div className="panel-body"> 
                            <div className="ct-chart ct-perfect-fourth" style={{width: '600px',height:'400px'}}></div>
                        </div>  
                        <table className="table"> 
                            <thead> 
                                <tr> 
                                    <th>#</th> 
                                    <th>First Name</th> 
                                    <th>Last Name</th> 
                                    <th>Username</th> 
                                </tr> 
                            </thead> 

                            <tbody> 
                                <tr> 
                                    <th scope="row">1</th> 
                                    <td>Mark</td> 
                                    <td>Otto</td> 
                                    <td>@mdo</td> 
                                </tr> 
                                <tr> 
                                    <th scope="row">2</th> 
                                    <td>Jacob</td> 
                                    <td>Thornton</td> 
                                    <td>@fat</td> 
                                </tr> 
                                <tr> 
                                    <th scope="row">3</th> 
                                    <td>Larry</td> 
                                    <td>the Bird</td> 
                                    <td>@twitter</td> 
                                </tr> 
                            </tbody> 
                        </table> 
                    </div>
                </div>
            </div>
        )

    },

    onOkClk:function() {
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = AssistorPopup;