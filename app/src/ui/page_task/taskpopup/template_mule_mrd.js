import RadioGroup from 'RadioGroup';
import './template_mule_mrd.less';
//import CurveComponent from '../../component_curve/index.js'; //todo.
import MuleMRD from './data/mule_mrd.js';
import {TableDOM} from 'Table';

var API = {
    param: undefined,
    project: undefined,
    uidata: {
        muleMRD: new MuleMRD(),
    },
    dm2ui: function(){
        var muleMRD = new MuleMRD();
        muleMRD.dm2ui(this.project, this.param);
        this.uidata.muleMRD = muleMRD;
    }
}

var MuleMRDTemplate = React.createClass({
    getInitialState() {
        return {
            param: this.props.param,
            project: this.props.project,
        }
    },

    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },
    componentDidMount: function(){
        MuleMRD.signal_expand_toggle.listen(this.onExpandToggle);
    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    componentWillUnmount: function(){
        MuleMRD.signal_expand_toggle.unlisten(this.onExpandToggle);
    },
	render(){
        API.param = this.state.param;
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
