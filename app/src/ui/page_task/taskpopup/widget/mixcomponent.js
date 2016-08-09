import Input from 'Input';
import ComboBox from 'ComboBox';
import Image from 'Image';

var MixComponent = React.createClass({

	render(){

		var inputParam = {
			value: ''
		}
		var comboboxParam = {
			selectedId: "", //string. existed id in options.
		    options: [{
		        id: "0",
		        label: "选项1",
		    },{
		        id: "1",
		        label: "选项2",
		    }],
		    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
		    onchange: function(){} //event triggered when selected item change.
		}
	  	var imageParam = {
	  		url: '/app/res/patac.jpeg'
	  	}


		return (<div>
			<Input param={inputParam}/>
			<ComboBox param={comboboxParam}/>
			<Image param={imageParam}/>
		</div>)
	}
})
module.exports = MixComponent;