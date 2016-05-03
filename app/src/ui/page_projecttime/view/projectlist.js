var ProjectList = React.createClass({
	getInitialState: function() {
        return {
            data: undefined,
        }
    },
    componentDidMount: function() {
        
    },
    render: function() {
        var pageHeader = "Project Name";
        return (
            <div className="panel panel-default">
              <div className="panel-heading">{pageHeader}</div>
              <ul className="list-group">
                <li className="list-group-item">Cras justo odio
                    <ul className='sub-list-group'>
                        <li>a</li>
                        <li>b</li>
                        <li>c</li>
                    </ul>
                </li>
                <li className="list-group-item">Dapibus ac facilisis in</li>
                <li className="list-group-item">Morbi leo risus</li>
                <li className="list-group-item">Porta ac consectetur ac</li>
                <li className="list-group-item">Vestibulum at eros</li>
              </ul>
            </div>
        );
    }
});

module.exports = ProjectList;
