import './index.less';

var UploadExcelComponent = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    componentWillReceiveProps: function(newProps) {
    },

    
    onDrop: function(e){

        var processWorkbook = function(workbook){
            debugger;
            var SHEET_NAME = 'SNORKEL';
            var worksheet = workbook.Sheets[SHEET_NAME];

            var address_of_cell = 'A9';
            var desired_cell = worksheet[address_of_cell];
            var desired_value = desired_cell ? desired_cell.v:undefined;



            var address_of_cell = 'A259';
            var desired_cell = worksheet[address_of_cell];
            var desired_value = desired_cell ? desired_cell.v:undefined;


            new Chartist.Line('.ct-chart', {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              series: [
                {name: 'OA-level', data: [20000, 30000, 35000, 32000, 40000, 42000, 50000, 62000, 80000, 94000, 100000, 120000]},
                {name: '2 order', data: [10000, 15000, 12000, 14000, 20000, 23000, 22000, 24000, 21000, 18000, 30000, 32000]},
                {name: '4 order', data: [10000, 15000, 12000, 14000, 20000, 23000, 22000, 24000, 21000, 18000, 30000, 32000]},
                {name: '6 order', data: [10000, 15000, 12000, 14000, 20000, 23000, 22000, 24000, 21000, 18000, 30000, 32000]}
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
                  return value.split('').slice(0, 3).join('');
                }
              },
              plugins: [
                Chartist.plugins.ctAccessibility({
                  caption: 'Fiscal year 2015',
                  seriesHeader: 'business numbers',
                  summary: 'A graphic that shows the business numbers of the fiscal year 2015',
                  valueTransform: function(value) {
                    return value + ' dollar';
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
                processWorkbook(workbook);
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
            <div className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop} >请将上传文件脱至此处</div>
            <div className="ct-chart ct-perfect-fourth" ></div>
          </div>
        );
     
    }
});

module.exports = UploadExcelComponent;
