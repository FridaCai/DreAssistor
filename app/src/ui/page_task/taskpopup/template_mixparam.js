import RadioGroup from 'RadioGroup';
import MuleMRDUI from './uidata/template_mixparam.js';
import {TableDOM} from 'Table';


var MixParamTemplate = React.createClass({
    getInitialState() {
        var {param, project} = this.props;
        
        var muleMRD = param;
        var muleMRDUI = new MuleMRDUI();
        muleMRDUI.dm2ui(project, param);


        return {
            muleMRD: muleMRD,
            muleMRDUI: muleMRDUI,
        }
    },

    componentDidMount: function(){
        MuleMRDUI.signal_expand_toggle.listen(this.onExpandToggle);
    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    componentWillUnmount: function(){
        MuleMRDUI.signal_expand_toggle.unlisten(this.onExpandToggle);
    },
    getValue(){
        this.state.muleMRDUI.ui2dm(this.state.muleMRD);
        return this.state.muleMRD;
    },
	render(){
        var uidata = {
            mulemrd:this.state.muleMRDUI
        };
        return (
            <div className='mule_mrd'>
               <TableDOM ref='table' 
                    uidata={uidata}/>
            </div>
        )
	}
});
module.exports = MixParamTemplate;
