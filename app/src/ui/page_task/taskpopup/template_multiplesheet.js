import RadioGroup from 'RadioGroup';
import {TableDOM} from 'Table';

import MultipleParamUIData from './uidata/multipleparam.js';
import MultipleSheetUIData from './uidata/multiplesheet.js';





var MultipleSheetTemplate = React.createClass({
    getInitialState() {
        var {param, project} = this.props;

        var multipleSheetUIData = new MultipleSheetUIData();
        multipleSheetUIData.dm2ui(project, param);

        return {
            multipleSheetUIData: multipleSheetUIData
        }
    },

    /*componentDidMount: function(){
        MultipleParamUIData.signal_expand_toggle.listen(this.onExpandToggle);
    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    componentWillUnmount: function(){
        MultipleParamUIData.signal_expand_toggle.unlisten(this.onExpandToggle);
    },
    getValue(){
        this.state.mixParamUIData.ui2dm(this.state.dm);
        return this.state.dm;
    },*/
    render(){
        var uidata = this.state.multipleSheetUIData.uidata;

        return (
            <div className='mixParamTemplate'>
               <TableDOM ref='table' 
                    uidata={uidata}/>
            </div>
        )
    }
});
module.exports = MultipleSheetTemplate;