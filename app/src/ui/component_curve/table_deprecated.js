import API from './api.js';

var Table = React.createClass({
    getInitialState: function() {
        return {
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

    onChange: function(index){
    	//this.props.onToggleCurve(index, isShow);
    	//todo:
    	index--; //bad
    	API.curve.series[index].isShow = !API.curve.series[index].isShow;

        API.dm2ui();

        API.signal_curve_toggle.dispatch({
        	index: index,
        	isShow: API.curve.series[index].isShow,
        });
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
        var ui = {
            sheetNames: [API.curveui.sheetName],
            sheets: [API.curveui.ui],
            headers: [API.curveui.header]
        }

        var dom = (function(i, label, className){
            if(i===0){
                return (
                    <th><span>{label}</span></th>
                )
            }else{
                debugger;//todo: think over here.
                if(!API.curve.series || !API.curve.series[i-1])
                    return null;

                var isCheck = API.curve.series[i-1].isShow;
                return (
                    <th>
                        <input type="checkbox" defaultChecked={isCheck} onChange={this.onChange.bind(this, i)}></input>  
                        <span className={className}></span>
                        <span>{label}</span>
                    </th>
                )
            }
        }).bind(this);

        return (
            <div className='excelTable' >
                <table>
                    <tbody>
                        {
                            ui.headers[this.state.sheetIndex].map((function(header, i){
                                //var isChecked = serie.isShow;
                                var label = header.v;
                                
                                //i++;
                                var className=`markcolor color${i-1}`; //todo: color css is not good.
                                //<input type="checkbox" checked={isChecked} onChange={this.onChange.bind(this, i, !isChecked)}></input>  
                                return (
                                    <tr key={i}>
                                        {dom(i, label, className)}
                                        
                                        {
                                            ui.sheets[this.state.sheetIndex].map(function(row, j){
                                                var cell = row[i];
                                                if(!cell || cell.isHide){
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
    	var {labels, series, caption} = API.curveui;

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


