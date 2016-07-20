import API from '../api.js';
import SuperAPI from '../../../../api.js';

var Table = React.createClass({

    //only depend on ui data.
	getInitialState: function() {
        return {
        	sheetIndex: 0,
        	uidata: this.props.uidata,
        };
    },
    onSwitchSheet: function(index){
        this.update({
            sheetIndex: index,
        });
    },  

    componentDidMount: function(){
        SuperAPI.sigal_window_resizeend.listen(this.updateAfterRender);
    },
    
    componentDidUnMount: function(){
        SuperAPI.sigal_window_resizeend.unlisten(this.updateAfterRender);
    },

    updateAfterRender: function(){
        (function updateTableBodyHeight(){
            var h = $('.projectPopupContainer .MsgBoxContent').height()
                    - $('.addOn').outerHeight() 
                    - parseInt($('.dataTable').css('marginTop'))
                    - $('.nav-tabs').outerHeight()
                    - $('.thead-inverse').outerHeight();
            $('tbody').height(h);
        })();

        (function updateTableCellWidth(){
            var widthList = [];
            $.each($(this.refs.tableBody).find('tr:first td'), function(index, td){
                widthList.push($(this).width());
            })

            var magicOffset = 2;
            $.each($(this.refs.tableHeader).find('th'), function(index, th){
                var width = widthList[index];
                $(this).width(width + magicOffset);
            })
        }).call(this);
    },

    onDrop: function(e){//for edit case, do nothing for drop.
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var reader = new FileReader();

        var file = files[0];
        var fileName = file.name;
        reader.onload = (function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});


            //deal with sorp_week in dm.
            var tempUI = this.excel2ui(workbook);
            var dm = this.ui2datamodel(tempUI);
            var ui = this.datamodel2ui(dm) 
            
            this.update({
                ui: ui
            });
        }).bind(this);
        reader.readAsBinaryString(file);
    },

    onDragOver(e){e.preventDefault();},

    onChange: function(cell, event){
        return;
        /*var inputValue = event.target.value;
        cell.v = inputValue;*/
    },

    onBlur: function(cell, event){
        return;
        /*var project = this.ui2datamodel(this.state.ui);

        if(cell.ref === 'sorp'){
            project.findTasks().map(function(task){
                task.startTime = undefined;
                task.endTime = undefined;
            })    
        }
        

        var ui = this.datamodel2ui(project);
        this.setState({ui: ui}, this.updateAfterRender);*/
    },

    update:function(param){
        this.setState(param, this.updateAfterRender);
    },

    render:function(){
        if(!this.state.uidata){
            return null;
        }

        var ui = {
            sheetNames: [this.state.uidata.property.sheetName, this.state.uidata.tag.sheetName],
            sheets: [this.state.uidata.property.ui, this.state.uidata.tag.ui],
        }
        
        var getSheetDom = (function(sheet){
            var dom = [];
            for(var i=1; i<sheet.length; i++){
                var line = sheet[i];
                var tr = [];

                line.map((function(cell, j){
                    var dom = cell.isEditable ? (
                        <input defaultValue={cell.v} type='text' onChange={this.onChange.bind(this, cell)} onBlur={this.onBlur.bind(this, cell)}/>
                    ) : (<span>{cell.v}</span>);
                    tr.push((
                        <td key={j}>{dom}</td>
                    ));
                }).bind(this))
                dom.push((
                    <tr key={i}>{tr}</tr>
                ));
            }
            return dom;
        }).bind(this);



        var getTableHeader = (function(sheet){
            var line = sheet[0];

            var dom = line.map(function(cell, j){
                return (<th key={j}><span>{cell.v}</span></th>)
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
                                {getTableHeader(ui.sheets[this.state.sheetIndex])}
                            </thead>
                            <tbody ref='tableBody'>
                                {getSheetDom(ui.sheets[this.state.sheetIndex])}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    },
})

module.exports = Table;