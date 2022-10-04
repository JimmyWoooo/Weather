import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';

export default class DescComponent extends Component {
    @tracked map;

    constructor(){
        super(...arguments);
        this.setMap();
    }

    setMap(){
        this.map = new Map();
        //thunder
        this.map.set('11d', Skycons.THUNDER_SHOWERS_DAY)
        this.map.set('11dEvening', Skycons.THUNDER_RAIN)
        this.map.set('11n', Skycons.THUNDER_SHOWERS_NIGHT)
        //rain
        this.map.set('10d', Skycons.SHOWERS_DAY)   
        this.map.set('10n', Skycons.SHOWERS_NIGHT)  
        this.map.set('09d', Skycons.RAIN) 
        this.map.set('09n', Skycons.RAIN) 
        //clear
        this.map.set('01d', Skycons.CLEAR_DAY)
        this.map.set('01n', Skycons.CLEAR_NIGHT) 
        //cloudy   
        this.map.set('02d', Skycons.PARTLY_CLOUDY_DAY)
        this.map.set('02n', Skycons.PARTLY_CLOUDY_NIGHT)    
        this.map.set('03d', Skycons.CLOUDY)
        this.map.set('03n', Skycons.CLOUDY)    
        this.map.set('04d', Skycons.CLOUDY)
        this.map.set('04n', Skycons.CLOUDY)    
        //snow
        this.map.set('13d', Skycons.SNOW_SHOWERS_DAY)
        this.map.set('13dEvening', Skycons.SNOW)    
        this.map.set('13n', Skycons.SNOW_SHOWERS_NIGHT)
        //if ID > 615 rain + snow
        this.map.set('13dRS', Skycons.RAIN_SNOW_SHOWERS_DAY)
        this.map.set('13dRSEvening', Skycons.RAIN_SNOW)
        this.map.set('13nRS', Skycons.RAIN_SNOW_SHOWERS_NIGHT)   
        //if sleet
        this.map.set('13dS', Skycons.SLEET)   
        this.map.set('13nS', Skycons.SLEET)
        //fog
        this.map.set('50d', Skycons.FOG)   
        this.map.set('50n', Skycons.FOG)    
        
        //console.log(this.map.get('50d'))
        //if time 4 _ 8 = evening
    }
}
