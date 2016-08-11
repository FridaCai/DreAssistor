import './index.less';
import {XlsIExport} from 'XlsIExport';
import {TableDOM} from 'Table';
import Curve from './data/curve.js';
import CurveUI from './uidata/curve.js';
import Chart from './chart.js';
import API from './api.js';

var CurveComponent = React.createClass({
  getInitialState: function(){
    this.api = new API();
    this.api.init();

    (function(curve){
        if(!curve)
    	   	return;

        api.setCurve(curve);
        api.dm2ui();      
    })(this.props.curve);

    return {
      id: this.props.id,
    }
  },

  render: function(){
    try{
      var disableXlsIExport = false;
      var sheetOptions = [{
          id: 'curve',
          label: '曲线',
          writeMode:[0]
      }];
      var id = this.state.id;
      return (
            <div className='curveComponent'>
                <XlsIExport ref='xlsIExport' 
                    disabled={disableXlsIExport} 
                    sheetOptions={sheetOptions}
                    onXlsImport={this.onXlsImport}
                    xls2ui = {this.xls2ui}
                    ui2xls = {this.ui2xls}
                    scope = {this}
                />
                <TableDOM ref='table' 
                    uidata={this.api.uidata} 
                    onDrop={this.onTableDrop}
                    isReverse={true}/>
               <Chart uidata={this.api.uidata} ref='chart' id={id}/>
            </div>
      );  
    }catch(e){
      console.log(e.stack);
    }
       
  },
  xls2ui: function(param){
    return this.api.xls2ui(param);
  },
  ui2xls: function(){
    this.api.ui2xls();
  },

  onXlsImport: function(){
      this.api.ui2dm();
      this.api.dm2ui();

      this.refs.table.update({uidata: this.api.uidata});
      this.refs.chart.update();
  },
  onTableDrop: function(files){
      var reader = new FileReader();

      var file = files[0];
      var fileName = file.name;
      reader.onload = (function(e){
          var data = e.target.result;
          var workbook = XLSX.read(data, {type: 'binary'});
          this.refs.xlsIExport.onPopupShow(workbook);
      }).bind(this);
      reader.readAsBinaryString(file);
  },

  componentDidMount: function(){
      this.api.signal_curve_toggle.listen(this.onCurveToggle);


      if(this.props.curve)
            return;

      API.loadTemplate().then((function(result){
          var curve = new Curve();
          curve.init(result);

          this.api.setCurve(curve); 
          this.api.dm2ui();


          this.refs.table.forceUpdate();
          this.refs.chart.update();
      }).bind(this)).catch((function(e){
          console.log(e.stack);
      }).bind(this));
  },

  componentWillUnmount: function(){
    this.api.signal_curve_toggle.unlisten(this.onCurveToggle);
  },
  onCurveToggle: function(e, param){
    this.refs.chart.onToggle();
  },
})

module.exports = CurveComponent;


