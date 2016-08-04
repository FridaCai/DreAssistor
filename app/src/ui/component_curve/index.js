import './index.less';
import API from './api.js';
import {XlsIExport} from 'XlsIExport';
import {TableDOM} from 'Table';
import Curve from './data/curve.js';

var CurveComponent = React.createClass({
  getInitialState: function(){
    (function(curve){
        if(!curve)
    		return;
        API.setCurve(curve);
        API.dm2ui();      
    })(this.props.curve);

    return {};
  },

  render: function(){
    var disableXlsIExport = false;
    var sheetOptions = [{
        id: 'curve',
        label: '曲线',
        writeMode:[0]
    }];
    return (
          <div className='curveComponent'>
              <XlsIExport ref='xlsIExport' 
                  disabled={disableXlsIExport} 
                  sheetOptions={sheetOptions}
                  onImportSheetDone={this.onXlsImport}
                  xls2ui = {API.xls2ui}
                  ui2xls = {API.ui2xls}
              />
              <TableDOM ref='table' 
                  uidata={API.uidata} 
                  onDrop={this.onTableDrop}/>
          </div>
    );   
  },

  onImportSheetDone: function(){
      API.ui2dm();
      API.dm2ui();
      this.refs.table.update({uidata: API.uidata});
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
      API.signal_curve_toggle.listen(this.onCurveToggle);


      if(this.props.curve)
            return;

      API.loadTemplate().then((function(result){
          var curve = new Curve();
          curve.init(result);

          API.setCurve(curve); 
          API.dm2ui();

          this.refs.table.forceUpdate();
          //this.refs.chart.update();
      }).bind(this)).catch((function(e){
          console.log(e.stack);
      }).bind(this));
  },

  componentDidUnMount: function(){
      API.signal_curve_toggle.unlisten(this.onCurveToggle);
  },
  onCurveToggle: function(e, param){
    //this.refs.chart.onCurveToggle(param);
  },
})

module.exports = CurveComponent;


