import RadioGroup from 'RadioGroup';
import {TableDOM} from 'Table';
import MultipleSheetUIData from './uidata/multiplesheet.js';
import MultipleParamUIData from './uidata/multipleparam.js';

var MultipleSheetTemplate = React.createClass({
    getInitialState() {
        var {param, project} = this.props;

        var multipleSheetUIData = new MultipleSheetUIData();
        multipleSheetUIData.dm2ui(project, param);
        return {
            dm: param,
            multipleSheetUIData: multipleSheetUIData
        }
    },

    componentDidMount: function(){
        MultipleParamUIData.signal_expand_toggle.listen(this.onExpandToggle);
        MultipleParamUIData.signal_data_change.listen(this.onDataChange);
        
    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    onDataChange: function(){
        this.state.multipleSheetUIData.ui2dm(this.state.dm);
        this.state.multipleSheetUIData.dm2ui(this.props.project, this.state.dm);
        this.refs.table.setState({uidata: this.state.multipleSheetUIData.uidata});
    },
    componentWillUnmount: function(){
        MultipleParamUIData.signal_expand_toggle.unlisten(this.onExpandToggle);
        MultipleParamUIData.signal_data_change.unlisten(this.onDataChange);
    },
    getValue(){
        this.state.multipleSheetUIData.ui2dm(this.state.dm);
        return this.state.dm;
    },
    onSwitchSheet(){
        this.state.multipleSheetUIData.ui2dm(this.state.dm);
        this.state.multipleSheetUIData.dm2ui(this.props.project, this.state.dm);
    },
    render(){
        var uidata = this.state.multipleSheetUIData.uidata;

        return (
            <div className='mixParamTemplate'>
               <TableDOM ref='table' 
                    uidata={uidata}
                    onSwitchSheet={this.onSwitchSheet}/>
            </div>
        )
    }
});
module.exports = MultipleSheetTemplate;