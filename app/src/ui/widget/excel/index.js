import './index.less';

var UploadExcelComponent = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    componentWillReceiveProps: function(newProps) {
    },

    
    onDrop: function(e){

        var processWorkbook = function(workbook, xlsFileName){
            var SHEET_NAME = 'SNORKEL';
            var COLORS = ['#46aac4','#f69240', '#4a7ebb', '#a7c36f', '#be4b48', '#7d60a0', '#ff0000', '#00ff00', '#0000ff', '#04fced'];
            var worksheet = workbook.Sheets[SHEET_NAME];


            /*var address_of_cell = 'A9';
            var desired_cell = worksheet[address_of_cell];
            var desired_value = desired_cell ? desired_cell.v:undefined;*/

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
            var seriesQA = getColumn(range.lineMin, range.lineMax, 'B');
            var series2Order = getColumn(range.lineMin, range.lineMax, 'C');
            var series4Order = getColumn(range.lineMin, range.lineMax, 'D');
            var series6Order = getColumn(range.lineMin, range.lineMax, 'E');

            
              
            
            new Chartist.Line('.ct-chart', {
              labels: labels,
              series: [
                {name: 'OA-level', data: seriesQA},
                {name: '2 order', data: series2Order},
                {name: '4 order', data: series4Order},
                {name: '6 order', data: series6Order}
              ]
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
              },
              plugins: [
                Chartist.plugins.ctAccessibility({
                  caption: xlsFileName,
                  seriesHeader: 'rpm',
                  summary: '',
                  valueTransform: function(value) {
                    return value;
                  },
                  // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
                  visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
                })
              ]
            });

        };



        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var i,f;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {type: 'binary'});
                processWorkbook(workbook, name);
            };
            reader.readAsBinaryString(f);
        }
    },

  onDragOver(e){
    e.preventDefault();
  },
  render: function() {
      return (
        <div className='uploadExcel'>
          <div className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop} >请将文件拖至此处上传</div>
          <div className="ct-chart ct-perfect-fourth" ></div>
        </div>
      );
   
  }
});

module.exports = UploadExcelComponent;
