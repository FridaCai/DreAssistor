//# read in src file.
//# generate property value according to key.
//# write file.

var fs = require('fs');
var parse = require('csv-parse');

var inputFile='src.csv';

var data = [];
var series = [];

var parser = parse({delimiter: ','}, function (err, lines) {
  	lines[0].map(function(cell, i){
  		if(cell){
  			series.push({
  				label: cell.trim(),
  				isShowCurve: true,
  				data: i
  			})
  		}
  	})

  	for(var i=0; i<series.length; i++){
  		var dataarr = [];

  		lines.map(function(line, j){
  			if(j!=0){
  				var cell = line[i];
				if(cell){
					dataarr.push(parseFloat(cell));
				}
  			}
  		})
  		data.push(dataarr);
  	}



	var desPath = './curve.json';
	fs.writeFile(desPath, JSON.stringify({data: data, series: series}, '',2), function(err, data){});



	
})
fs.createReadStream(inputFile).pipe(parser);





