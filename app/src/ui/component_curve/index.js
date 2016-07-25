import './index.less';
import {Util} from '../widget/excel/util.js';
import XlsIExport from '../widget/excel/xls_im_export.js';
import Popup from '../widget/excel/popup.js';
import API from './api.js';

//import Table from './table.js';
/*
  labels: [],
  series: [],
  caption: '',
*/

var CurveComponent = React.createClass({
  getInitialState: function(){
    return {
      uidata: this.props.uidata, //todo.  
    }
  },

  onXlsImport: function(param){
      API.signal_popup_show.dispatch(param);
  },
  componentDidUnMount: function(){
      API.signal_popup_show.unlisten(this.onPopupShow);
  },
  
  componentDidMount: function(){
      API.signal_popup_show.listen(this.onPopupShow);
  },

  onPopupShow: function(e, param){
        var workbook = param.workbook;


        //todo: fail to find this.refs.t_popup after close addProjectPopup. very strange. try to unmount dom element after message box hide.
        ReactDOM.unmountComponentAtNode($('.t_popup')[0]);    
        ReactDOM.render(<Popup tryXls2ui={API.tryXls2ui.bind(API)} title={'导入excel'} workbook={workbook} onOK={(function(){
            this.refs.table.update({uidata: API.uidata});
        }).bind(this)}/>, $('.t_popup')[0]);  
    },


  render: function(){
    /*
      
      <Chart ref='chart' uidata={this.state.uidata}/>
        <Table ref='table' uidata={this.state.uidata}/>
    */
    var disableXlsImExPort = false;
    return (
      <div className='curveComponent'>
          <XlsIExport disabled={disableXlsImExPort} next={this.onXlsImport}/>
          <div className='t_popup' ref='t_popup'/>

      </div>
    )
  }
})






/*
var UploadExcelComponent = React.createClass({
  parseFile: function(fileName){
      var processWorkbook = (function(workbook, xlsFileName){
          var SHEET_NAME = 'SNORKEL';
          var COLORS = ['#46aac4','#f69240', '#4a7ebb', '#a7c36f', '#be4b48', '#7d60a0', '#ff0000', '#00ff00', '#0000ff', '#04fced'];
          var worksheet = workbook.Sheets[SHEET_NAME];


          var range = Util.getRange(worksheet['!ref']);



         

          var getColumn = function(min, max, columnName){
            var returnLabel = [];
            for(var i=min; i<=max; i++){
              var key = `${columnName}${i}`;

              var value = worksheet[key];

              if(value && value.t == 'n'){
                var tmp = Math.round(value.v * 100) / 100;
                returnLabel.push(tmp);
              }
            }
            return returnLabel;
          }
          

          var labels = getColumn(range.lineMin, range.lineMax, 'A'); // a9-a259
          var series = [{
            label: worksheet['B3'].v,
            isShow: true,
            data: getColumn(range.lineMin, range.lineMax, 'B')
          }, {
            label: worksheet['C3'].v,
            isShow: true,
            data: getColumn(range.lineMin, range.lineMax, 'C')
          }, {
            label: worksheet['D3'].v,
            isShow: true,
            data: getColumn(range.lineMin, range.lineMax, 'D')
          }, {
            label: worksheet['E3'].v,
            isShow: true,
            data: getColumn(range.lineMin, range.lineMax, 'E')
          }];

          return {
            labels: labels,
            series: series,
            caption: xlsFileName,
          };
      }).bind(this);
  },

  execute: function(fileNames){
    var promiseArr = fileNames.map((function(fileName){
      return this.parseFile(fileName);
    }).bind(this));
    Promise.all(promiseArr).then((function(params){
      var labels = params[0].labels;
      var captions = [];
      var series = [];
      
      params.map(function(param){
        series = series.concat(param.series);
        captions = captions.concat(param.caption);
      })
      
      this.setState({
          labels: labels,
          series: series,
          caption: captions.join(' & '),
      }, this.updateChart);
    }).bind(this)); 
  },

  isShowChart: function(charts){
    return (!charts || charts.length === 0) ? false: true;
  },
  componentDidMount: function(){
    var isShowChart = this.isShowChart(this.state.fileNames);
    if(!isShowChart)
      return;

    this.execute(this.state.fileNames);
  },

  render: function() {
      var isShowChart = this.isShowChart(this.state.fileNames);
      var chartTableStyle = isShowChart ? {display: 'block'}: {display:'none'};
      var dragAreaStyle = this.props.isForbidUpload ? {display: 'none'} : {display: 'block'};

      return (
        <div className='uploadExcel'>
          <div className='chartTable' style={chartTableStyle}>
            <div className="ct-chart ct-perfect-fourth" ></div>
            <Table labels={this.state.labels} series={this.state.series} caption={this.state.caption} 
              onToggleCurve={this.onToggleCurve}/>
          </div>
        </div>
      );
  }
});*/

module.exports = CurveComponent;
