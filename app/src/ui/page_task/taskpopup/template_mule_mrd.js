import RadioGroup from 'RadioGroup';
import MuleMRDUI from './data/mule_mrd.js';
import {TableDOM} from 'Table';

var API = {
    project: undefined,
    uidata: {
        muleMRDUI: new MuleMRDUI(),
    },
    muleMRD: undefined,

    dm2ui: function(){
        if(!this.muleMRD)
            return;

        var muleMRDUI = new MuleMRDUI();
        muleMRDUI.dm2ui(this.project, this.muleMRD);
        this.uidata.muleMRDUI = muleMRDUI;
    },
    ui2dm: function(){
        this.uidata.muleMRDUI.ui2dm(this.muleMRD);
    }
    
}
window.dre.mulemrd = {
    data: API
};

var MuleMRDTemplate = React.createClass({
    getInitialState() {
        return {
            param: this.props.param,
            project: this.props.project,
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
        API.ui2dm();
        return API.muleMRD;
    },
	render(){
        API.muleMRD = this.state.param;
        API.project = this.state.project;
        API.dm2ui();
        var uidata = API.uidata;

        return (
            <div className='mule_mrd'>
               <TableDOM ref='table' 
                    uidata={uidata}/>
            </div>
        )
	}
});
module.exports = MuleMRDTemplate;
