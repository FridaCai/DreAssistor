import RadioGroup from 'RadioGroup';
import {TableDOM} from 'Table';
import MultipleSheetUIData from './uidata/multiplesheet.js';

var MultipleSheetTemplate = React.createClass({
    getInitialState() {
        var {param, project} = this.props;

        var multipleSheetUIData = new MultipleSheetUIData();
        multipleSheetUIData.dm2ui(project, param);
        return {
            dm: param,
            uidata: multipleSheetUIData
        }
    },

    componentDidMount: function(){
        this.state.uidata.signal_expand_toggle.listen(this.onExpandToggle);
        this.state.uidata.signal_data_change.listen(this.onDataChange);
    },
    onExpandToggle: function(e, param){
        if(!param.isOpen){
            this.state.uidata.ui2dm(this.state.dm);
            this.state.uidata.dm2ui(this.props.project, this.state.dm);
        }
        this.refs.table.update({
            uidata: this.state.uidata
        });
    },
    onDataChange: function(){
        this.state.uidata.ui2dm(this.state.dm);
        this.state.uidata.dm2ui(this.props.project, this.state.dm);
        this.refs.table.setState({uidata: this.state.uidata});
    },
    componentWillUnmount: function(){
        this.state.uidata.signal_expand_toggle.unlisten(this.onExpandToggle);
        this.state.uidata.signal_data_change.unlisten(this.onDataChange);
    },
    getValue(){
        this.state.uidata.ui2dm(this.state.dm);
        return this.state.dm;
    },
    onSwitchSheet(){
        this.state.uidata.ui2dm(this.state.dm);
        this.state.uidata.dm2ui(this.props.project, this.state.dm);
    },
    render(){
        var uidata = this.state.uidata;

        return (
            <div className='mixParamTemplate'>
               <TableDOM ref='table' 
                    uidata={uidata}
                    onSwitchSheet={this.onSwitchSheet}
                    isReadOnly={this.props.isReadOnly}/>
            </div>
        )
    }
});
module.exports = MultipleSheetTemplate;