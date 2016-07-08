
import API from '../api.js';
import Util from '../../../util.js';

var Table = React.createClass({
    getInitialState: function() {
        return {};
    },

	render: function(){
		var condition = this.props.condition;
		var allpropertyKeys = ['label', 'template.type'].concat(this.props.allpropertyKeys);
		var getStaticalValueHandler = this.props.getStaticalValueHandler;

        var groups = API.getProjectArr().map(function(project){
        	return {
        		label: project.label,
        		lines: project.findTasks(condition)
        	}
        });

        var lineNum = 0;
        return (
            <div className='panel panel-default tableSession'>
            {
               	groups.map((function(group){
                    var lines = group.lines;
                    var header = group.label;
                    {
                        if(lines.length){
                            return (
                                <div className='projectDom' key={header}>
                                    <div className="panel-heading">项目： {header}</div>
                                    <table className="table"> 
                                        <thead> 
                                            <tr>
                                                <th>#</th>
                                                {
                                                    allpropertyKeys.map((function(column){
                                                        var key = `column_${column}`;
                                                        var label = Util.COLUMN_LABLE_MAP[column];
                                                        return (<th key={key}>{label}</th>)
                                                    }).bind(this))
                                                }
                                            </tr> 
                                        </thead> 
                                        <tbody> 
                                        {
                                            lines.map((function(line){
                                                var lineId = line.id;
                                                return (
                                                    <tr key={lineId}>
                                                        <th scope="row">{lineNum++}</th>
                                                        {
                                                            allpropertyKeys.map((function(column){
                                                                var columnKey = `${lineId}_${column}`;
                                                                return (
                                                                    <td key={columnKey}>{getStaticalValueHandler(line, column)}</td>
                                                                )
                                                            }).bind(this))
                                                        }
                                                    </tr> 
                                                )
                                            }).bind(this))
                                        }
                                        </tbody> 
                                    </table>    
                                </div>
                            )
                        }
                    }
                }).bind(this))
            }
            </div>
        )
	}
})
module.exports = Table;


