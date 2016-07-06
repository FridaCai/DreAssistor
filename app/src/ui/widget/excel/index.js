import './index.less';
import Table from './table.js';

//# load, no files
//# load, has files;
//# drag and drop;

//load excel files; parse xlsx files; draw chart and table.

var UploadExcelComponent = React.createClass({
  getInitialState: function() {
      return {
        fileNames: this.props.fileNames,
        labels: [],
        series: [],
        caption: '',
      }
  },

  getFileNames: function(){
    return this.state.fileNames;
  },

  _chart:undefined,
  updateChart: function(){
    var labels = this.state.labels;
    var _series = this.state.series;
    var caption = this.state.caption;

    var series = [];
    for(var i=0; i<_series.length; i++){
      var serie = _series[i];
      series.push(serie.data);
    }

    if(this._chart){
      this._chart.detach();
      this._chart.svg.remove();
    }

    this._chart = new Chartist.Line('.ct-chart', {
      labels: labels,
      series: series,
    }, {
      fullWidth: true,
      lineSmooth: false,
      chartPadding: {
        right: 20,
        left: 10
      },
      axisX: {
        labelInterpolationFnc: function(value) {
          if(value % 500 === 0){
            return value;  
          }
        }
      }
    });
  },

  onDrop: function(e){
      e.stopPropagation();
      e.preventDefault();
      var files = e.dataTransfer.files;
      //todo: upload to server. load file from server and extract chart and table value;
      var fileName = files[0].name;

      this.setState({
        fileNames: [fileName],
      })
      this.execute(this.state.fileNames);
  },

  onDragOver(e){
    e.preventDefault();
  },

  onToggleCurve(index, isShow){
    this.state.series[index].isShow = isShow;
    $($('.ct-series')[index]).toggle();  
  },
    
  parseFile: function(fileName){
      var processWorkbook = (function(workbook, xlsFileName){
          var SHEET_NAME = 'SNORKEL';
          var COLORS = ['#46aac4','#f69240', '#4a7ebb', '#a7c36f', '#be4b48', '#7d60a0', '#ff0000', '#00ff00', '#0000ff', '#04fced'];
          var worksheet = workbook.Sheets[SHEET_NAME];

          var range =  (function(raw){
            var reg = /^([A-Z]*)(\d*)\:([A-Z]*)(\d*)$/;
            var result = raw.match(reg);

            return {
              lineMin: parseInt(result[2]),
              lineMax: parseInt(result[4]),
              columnMin: result[1],
              columnMax: result[3],
            }
          })(worksheet['!ref']);

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


      var filePath = `/app/res/${fileName}`;
      var oReq = new XMLHttpRequest();

      return new Promise(function(resolve, reject){
        oReq.open("GET", filePath, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = (function(e) {
          var arraybuffer = oReq.response;
          var data = new Uint8Array(arraybuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) 
            arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          
 
          var workbook = XLSX.read(bstr, {type:"binary"});
          var result = processWorkbook(workbook, fileName);

          resolve(result);
        }).bind(this);

        oReq.send();  
      })
      
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

  componentDidMount: function(){
    if(!this.state.fileNames)
      return;
    this.execute(this.state.fileNames);
  },

  render: function() {
      var chartTableStyle = this.state.fileNames ? {display: 'block'}: {display:'none'};
      var dragAreaStyle = this.props.isForbidUpload ? {display: 'none'} : {display: 'block'};

      return (
        <div className='uploadExcel'>



          <div style={dragAreaStyle} className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop}>
            请将文件拖至此处上传
          </div>
          <div className='chartTable' style={chartTableStyle}>
            <div className="ct-chart ct-perfect-fourth" ></div>
            <Table labels={this.state.labels} series={this.state.series} caption={this.state.caption} 
              onToggleCurve={this.onToggleCurve}/>
          </div>
        </div>
      );
  }
});

module.exports = UploadExcelComponent;
