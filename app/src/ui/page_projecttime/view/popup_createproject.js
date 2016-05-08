
var CreateProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            isShow: true,
        }
    },
    componentDidMount: function() {
        
    },
    render: function() {
        if(!this.state.isShow) 
            return null;

        return (<div className="createProjectPopup" data-reactid=".0.1.3">
                    <div className="mask"></div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            常用项目
                            <span className='closeBtn'>X</span>
                        </div>
                        <div className="panel-body">
                            <ul>
                                <li>
                                    <span>A10</span>
                                    <ul>
                                        <li>
                                            <input type="checkbox"/>
                                            <span>10</span>
                                        </li>
                                        <li>
                                            <input type="checkbox"/>
                                            <span>10</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="footer">
                          <a href="#" className="btn btn-primary" role="button">确定</a> 
                          <a href="#" className="btn btn-default" role="button">取消</a>
                        </div>
                    </div>
                </div>);    
    }
});

module.exports = CreateProjectPopup;




