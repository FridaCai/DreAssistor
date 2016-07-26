import API from './api.js';

var Table = React.createClass({
    getInitialState: function() {
        return {
        	uidata: this.props.uidata,
        	sheetIndex:0,
        }
    },
    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },
    update:function(param){
    	this.setState(param);
    },
    /*
	componentWillReceiveProps: function(newProps){
		this.setState({
			labels: newProps.labels,
			series: newProps.series,
		})
	},*/
    onChange: function(index, isShow){
    	//this.props.onToggleCurve(index, isShow);
    	//todo:
    	API.signal_curve_toggle.dispatch({
    		index: index,
    		isShow: isShow,
    	})
    	var series = this.state.uidata.series;
    	series[index].isShow = isShow;

    	/*this.setState({
    		series: series,
    	})*/
    },
	onDrop: function(e){
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var reader = new FileReader();

        var file = files[0];
        var fileName = file.name;
        reader.onload = (function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            API.signal_popup_show.dispatch({workbook: workbook});
        }).bind(this);
        reader.readAsBinaryString(file);
	},


	onDragOver(e){
		e.preventDefault();
	},

	render: function(){
		if(!this.state.uidata){
            return null;
        }

        var ui = {
            sheetNames: [this.state.uidata.sheetName],
            sheets: [this.state.uidata.ui],
            headers: [this.state.uidata.header]
        }

        return (
            <div className='excelTable' >
                <table>
                    <tbody>
                        {
                            ui.headers[this.state.sheetIndex].map((function(header, i){
                                //var isChecked = serie.isShow;
                                var label = header.v;
                                
                                //i++;
                                var className=`markcolor color${i}`;
                                //<input type="checkbox" checked={isChecked} onChange={this.onChange.bind(this, i, !isChecked)}></input>  
                                return (
                                    <tr key={i}>
                                        <td>
                                            <input type="checkbox"></input>  
                                            <span className={className}></span>
                                            <span>{label}</span>
                                        </td>
                                        {
                                            ui.sheets[this.state.sheetIndex].map(function(row, j){
                                                var cell = row[i];
                                                if(cell.isHide){
                                                    return null;
                                                }
                                                return (<td key={j}>{cell.v}</td>)    
                                            })                                                
                                        }
                                    </tr>
                                )       
                            }).bind(this))
                        }
                        
                    </tbody>
                </table>
            </div>
        )
	},

    render_deprecated: function(){
    	var i = -1;
    	var {labels, series, caption} = this.state.uidata;

	    return (
			<div className='excelTable' >
				<table>
					<caption>{caption}</caption>
					<tbody>
						<tr>
							<th scope="col" role="columnheader"></th>
							<th scope="col" role="columnheader">rpm</th>
							{
								labels && labels.map((function(label){
									return (
										<th scope="col" role="columnheader" key={label}>{label}</th>
									)
								}).bind(this))
							}
						</tr>
						{
							series && series.map((function(serie){
								var isChecked = serie.isShow;
								var label = serie.label;
								
								i++;
								var className=`markcolor color${i}`;
								
								return (
									<tr key={i}>
										<th scope="row" role="rowheader">
											<input type="checkbox" checked={isChecked} onChange={this.onChange.bind(this, i, !isChecked)}></input>  
											<span className={className}></span>
										</th>
										<th scope="row" role="rowheader">{label}</th>
										{
											serie.data.map(function(value, index){
												return (<td key={index}>{value}</td>)
											})
										}
										
									</tr>
								)		
							}).bind(this))
						}
						
					</tbody>
				</table>
			</div>
	    )
    }
});

module.exports = Table;


