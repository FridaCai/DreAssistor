import RadioGroup from 'RadioGroup';
import {TableDOM} from 'Table';
import Sheet0 from './data/benchmark/sheet0.js';

/*
    sheet1: new Sheet1(),
    sheet2: new Sheet2(),
    sheet3: new Sheet3(),
    sheet4: new Sheet4(),
    sheet5: new Sheet5(),
*/

var API = {
    uidata: {
        sheet0: new Sheet0(),
    },
    benchmark: undefined,

    dm2ui: function(){
        /*if(!this.benchmark)
            return;*/

        var sheet0 = new Sheet0();
        sheet0.dm2ui(this.benchmark);
        this.uidata.sheet0 = sheet0;
    },
    ui2dm: function(){
        //this.uidata.sheet0.ui2dm(this.benchmark);
    }
}


window.dre.benchmark = {
    data: API
};

var BenchmarkTemplate = React.createClass({
    getInitialState() {
        return {
            param: this.props.param,
        }
    },

    componentDidMount: function(){
       // BenchmarkUI.signal_expand_toggle.listen(this.onExpandToggle);
    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    componentWillUnmount: function(){
        //BenchmarkUI.signal_expand_toggle.unlisten(this.onExpandToggle);
    },
    getValue(){
        API.ui2dm();
        return API.benchmark;
    },
	render(){
        API.benchmark = this.state.param;
        API.dm2ui();
        var uidata = API.uidata;

        return (
            <div className='benchmark'>
               <TableDOM ref='table' 
                    uidata={uidata}/>
               }
            </div>
        )
	}
})


module.exports = BenchmarkTemplate;