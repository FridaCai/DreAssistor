import Engine from './engine.js';

module.exports = class Engines extends Array{
	static create(param){
		var engines = new Engines();
		engines.init(param);
		return engines;
	}

	constructor(){
		super();
	}

	init(param){
		param.map((function(p){
			var engine = Engine.create(p);
			super.push(engine);
		}).bind(this))
	}

	dump(){
		return this.map(function(engine){
			return engine.dump()
		})
	}

	//engine; engine param; empty param.
	addEngine(param){
		var engine;
		if(!param){
			engine = Engine.create({ //todo: problem.
			  properties: [{
		        label: "engine",
		        text: "new engine",
		        key: "PROJECT.ENGINE.LABEL"
		      },
		      {
		        label: "Transmission",
		        text: "Transmission",
		        key: "PROJECT.ENGINE.TRANSMISSON"
		      },
	            {
	              "text": "Driveline1",
	              "label": "Driveline",
	              "key": "PROJECT.ENGINE.DRIVELINE"
	            },
	            {
	              "text": "Emissions Regulation level1",
	              "label": "Emissions Regulation level",
	              "key": "PROJECT.ENGINE.EMISSIONS_REGULARTION_LEVEL"
	            },{
	              "text": "cold engine idle speed1",
	              "label": "cold engine idle speed",
	              "key": "PROJECT.ENGINE.COLD_ENGINE_IDLE_SPEED"
	            },{
	              "text": "warm engine idle speed1",
	              "label": "warm engine idle speed",
	              "key": "PROJECT.ENGINE.WARM_ENGINE_IDLE_SPEED"
	            },{
	              "value": 0,
	              "label": "Pass By Requirement",
	              "key": "PROJECT.ENGINE.PASS_BY_REQUIREMENT"
	            },{
	              "value": 0,
	              "label": "Warranty",
	              "key": "PROJECT.ENGINE.WARRANTY"
	            },{
	              "text": "Target design life1",
	              "label": "Target design life",
	              "key": "PROJECT.ENGINE.TARGET_DESIGN_LIFE"
	            },{
	              "curve": null,
	              "label": "Insulator DPDS Requirement",
	              "key": "PROJECT.ENGINE.INSULATOR_DPDS_REQUIREMENT"
	            },{
	              "value": 0,
	              "label": "Panel Mode Requirement",
	              "key": "PROJECT.ENGINE.PANEL_MODE_REQUIREMENT"
	            },{
	              "value": 0,
	              "label": "Hanger Natrural Frequency Requirement",
	              "key": "PROJECT.ENGINE.HANGER_NATRURAL_FREQUENCY_REQUIREMENT"
	            },{
	              "value": 0,
	              "label": "Mass Target",
	              "key": "PROJECT.ENGINE.MASS_TARGET"
	            },{
	              "value": 0,
	              "label": "Rated Power@ speed  (Power @ RPM) ",
	              "key": "PROJECT.ENGINE.RATED_POWER_AT_SPEED"
	            },{
	              "value": 0,
	              "label": "Maximum engine RPM",
	              "key": "PROJECT.ENGINE.MAXIMUM_ENGINE_RPM"
	            },{
	              "value": 0,
	              "label": "Minimum engine RPM",
	              "key": "PROJECT.ENGINE.MINIMUM_ENGINE_RPM"
	            },{
	              "value": 0,
	              "label": "Maximum air flow g/sec (above peak power)",
	              "key": "PROJECT.ENGINE.MAXIMUM_AIR_FLOW"
	            },{
	              "value": 0,
	              "label": "Minimum air flow g/sec  (at XXX RPM idle)",
	              "key": "PROJECT.ENGINE.MINIMUM_AIR_FLOW"
	            },{
	              "value": 0,
	              "label": "Inlet Pressure Loss and Flow (XX kPa @ YY g/s)",
	              "key": "PROJECT.ENGINE.INLET_PRESSURE_LOSS_AND_FLOW"
	            },{
	              "value": 0,
	              "label": "Total System Exhaust Backpressure and Flow (XX kPa @ YY g/s & ZZ deg C)",
	              "key": "PROJECT.ENGINE.TOTAL_SYSTEM_EXHAUST_BACKPRESSURE_AND_FLOW"
	            },{
	              "value": 0,
	              "label": "System Backpressure Post 1st Aftertreatment  (XX kPa @ YY g/s & ZZ deg C)",
	              "key": "PROJECT.ENGINE.SYSTEM_BACKPRESSURE_POST_1ST_AFTER_TREATMENT"
	            },{
	              "value": 0,
	              "label": "PT Aftertreatment Backpressure Allocation (xx kPa @ yy g/s & zz deg C)",
	              "key": "PROJECT.ENGINE.PT_AFTER_TREATMENT_BACKPRESSURE_ALLOCATION"
	            }
		      ]
		    });
			
		}else if(param instanceof Engine){
			engine = param;
		}else{
			engine = Engine.create(param);
		}
		this.unshift(engine);
	}
	deleteEngine(engine){
		var id = engine.id;
		var index = -1;
		for(var i=0; i<this.length; i++){
			var engine = this[i];
			if(engine.id === id){
				index = i;
				break;
			}
		}
		this.splice(index, 1);
	}
	copyEngine(engine){
		var cloneEngine = engine.clone();
		
		var keys = Object.keys(cloneEngine.properties);

		for(var i=0; i<keys.length; i++){
			var key = keys[i];
			var property = cloneEngine.properties[key];
			if(property.key === "PROJECT.ENGINE.LABEL"){
				property.text = `copy of ${property.text}`;
				break;		
			}
		}
		

		this.unshift(cloneEngine);
	}
	clear(){
		this.length = 0;
	}
}
