import {sigal_window_resizeend} from '../../../api.js';

var Table = React.createClass({
	getInitialState: function() {
        return {
        	sheetIndex: 0,
        	uidata: this.props.uidata,
            onDrop: this.props.onDrop,
        };
    },
    onSwitchSheet: function(index){
        this.update({
            sheetIndex: index,
        });
    },  

    componentDidMount: function(){
        sigal_window_resizeend.listen(this.updateAfterRender);
    },
    
    componentDidUnMount: function(){
        sigal_window_resizeend.unlisten(this.updateAfterRender);
    },

    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },

    updateAfterRender: function(){
        (function updateTableBodyHeight(){
            var h = $('.projectPopupContainer .MsgBoxContent').height()
                        - $('.addOn').outerHeight() 
                        - parseInt($('.addOn').css('marginTop')) 
                        - parseInt($('.dataTable').css('marginTop'))
                        - $('.nav-tabs').outerHeight()
                        - $('.thead-inverse').outerHeight();
            $('tbody').height(h);
        }).call(this)
    },

    onDrop: function(e){//for edit case, do nothing for drop.
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        this.state.onDrop(files);
    },

    onDragOver(e){e.preventDefault();},

    update:function(param){
        this.setState(param, this.updateAfterRender);
    },

    render:function(){
        try{
            if(!this.state.uidata){
                return null;
            }

            var ui = (function(uidata){
                return {
                    sheetNames: [uidata.property.sheetName, uidata.tag.sheetName, uidata.task.sheetName],
                    sheets: [uidata.property.ui, uidata.tag.ui, uidata.task.ui],
                    headers: [uidata.property.header, uidata.tag.header, uidata.task.header]
                }
            })(this.state.uidata);

            var getPercentage = (function(cellArr){
                var tmp = cellArr.filter(function(cell){
                    return !cell.isHide;
                })
                return `${(1/tmp.length)*100}%`;
            });
            
            var getSheetDom = (function(sheet){
                var dom = [];
                for(var i=0; i<sheet.length; i++){
                    var line = sheet[i];
                    var tr = [];

                    var percentage = getPercentage(line);
                    line.map((function(cell, j){
                        if(!cell.isHide){
                            tr.push((
                                <td key={j} style={{width:percentage}}>{cell.getDom()}</td>
                            ));    
                        }
                    }).bind(this))

                    dom.push((
                        <tr key={i}>{tr}</tr>
                    ));
                }
                return dom;
            }).bind(this);

            var getTableHeader = (function(header){
                var percentage = getPercentage(header);
                var dom = header.map(function(cell, j){
                    if(cell.isHide)
                        return null;
                    return (<th style={{width:percentage}} key={j}>{cell.getDom()}</th>)    
                });
                return (
                    <tr>
                      {dom}
                    </tr>
                )
            }).bind(this)
            
            return (
                <div className='panel-body projectPopup' onDragOver={this.onDragOver} onDrop={this.onDrop}>
                    <div className='dataTable' >
                        <ul className="nav nav-tabs">
                        {
                            ui.sheetNames.map((function(sheetName, index){
                                var className = (index === this.state.sheetIndex ? 'active': '');
                                return (
                                    <li role="presentation" className={className} key={index.toString()} onClick={this.onSwitchSheet.bind(this, index)}>
                                        <a href="javascript:void(0);">{sheetName}</a>
                                    </li>
                                )
                            }).bind(this))
                        }
                        </ul>
                        <div className='sheet'>
                            <table>
                                <thead className="thead-inverse" ref='tableHeader'>
                                    {getTableHeader(ui.headers[this.state.sheetIndex])}
                                </thead>
                                <tbody ref='tableBody'>
                                    {getSheetDom(ui.sheets[this.state.sheetIndex])}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        }catch(e){
            debugger;
            console.log(e.stack);
        }
    },
})
module.exports = Table;