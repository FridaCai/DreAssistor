var Table = React.createClass({
	getInitialState: function() {
		this.PROPERTY_SHEETNAME = 'auto_property';
		this.TAGS_SHEETNAME = 'auto_tags';

        var project = this.props.project;
        var ui = this.datamodel2ui(project);
        return {
        	sheetIndex: 0,
        	ui: ui,
        };
    },
    onSwitchSheet: function(index){
        this.setState({
            sheetIndex: index,
        }, this.updateAfterRender)
    },  

    componentDidMount: function(){
        this.loadTemplateData();
        SuperAPI.sigal_window_resizeend.listen(this.updateAfterRender);
    },
    componentDidUnMount: function(){
        SuperAPI.sigal_window_resizeend.unlisten(this.updateAfterRender);
    },


    updateAfterRender: function(){
        (function updateTBodyHeight(){
            var h = $('.projectPopup').height()
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
        })();
    },
    
    loadTemplateData: function(){
        if(this.state.ui)
            return;
        Request.getData(Request.getMockupAPI('template_project.json')).then((function(result){
            var project = new Project();
            project.init(result);
            this.setState({ui: this.datamodel2ui(project)}, this.updateAfterRender);
        }).bind(this))
    },
    
    onDrop: function(e){
        if(this.isEdit())
            return;
        
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
            
            this.setState({
                ui: ui
            }, this.updateAfterRender)
        }).bind(this);
        reader.readAsBinaryString(file);
    },

    onDragOver(e){e.preventDefault();},

    onChange: function(cell, event){
        var inputValue = event.target.value;
        cell.v = inputValue;
    },

    onBlur: function(cell, event){
        var project = this.ui2datamodel(this.state.ui);

        if(cell.ref === 'sorp'){
            project.findTasks().map(function(task){
                task.startTime = undefined;
                task.endTime = undefined;
            })    
        }
        

        var ui = this.datamodel2ui(project);
        this.setState({ui: ui}, this.updateAfterRender);
    },
    isEdit: function(){
        if(this.props.project)
            return true;
        return false;
    },

    render:function(){
        if(!this.state.ui){
            return null;
        }
     
        var getSheetDom = (function(){
            var sheetName = this.state.ui.sheetNames[this.state.sheetIndex];
            var sheet = this.state.ui.sheets[sheetName];

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



        var getTableHeader = (function(){
            var sheetName = this.state.ui.sheetNames[this.state.sheetIndex];
            var sheet = this.state.ui.sheets[sheetName];
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
                        this.state.ui.sheetNames.map((function(sheetName, index){
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
                                {getTableHeader()}
                            </thead>
                            <tbody ref='tableBody'>
                                 {getSheetDom()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    },
})

module.exports = Table;