import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import ENV from '../config/environment'

export default class WeatherTrackerComponent extends Component {
    @tracked weather;
    @tracked unit;
    @tracked description;
    @tracked main;
    @tracked temperature;
    @tracked zipcode;
    @tracked location;
    @tracked feels;
    @tracked humidity;
    @tracked precipitation;
    @tracked lat;
    @tracked lon;
    @tracked high;
    @tracked low;
    @tracked date = new Date().toLocaleTimeString('en-US');
    weatherKey = ENV.APP.WEATHER_API_KEY;
    geoKey = ENV.APP.GEO_API_KEY;
    //55456 error zip
    @tracked sunRise;
    @tracked sunSet;
    @tracked correctZip = false;
    @tracked ws;
    @tracked loaded = false
    @tracked weatherDesc;
    @tracked typeTimer = null;
    //try catch

    constructor(){
        super(...arguments);
        if(localStorage.getItem('unit') == null){
            localStorage.setItem('unit', 'fahrenheit');
            this.unit = 'fahrenheit';
        }
        else{
            this.unit = localStorage.getItem('unit');
        }
        if(localStorage.getItem('cookiezip')){
            this.zipcode = localStorage.getItem('cookiezip');
            this.loadLocationZip();
        }
        else{
            const sucessCall = (position) => {
                document.cookie = position.coords.latitude + "," + position.coords.longitude;
                this.loadLocation();
                this.loadweather();
            }
            const errorCall = (error) => {
                console.error(error);
            }
            navigator.geolocation.getCurrentPosition(sucessCall, errorCall);
        }
        this.weatherDesc = this.args.weatherDesc;
    }

    setZip(input){
        if(this.zipcode != input.target.value){
            let charCode = input.keyCode;
            if((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 95 && charCode < 106) || charCode == 32){
                clearTimeout(this.typeTimer);
                this.typeTimer = setTimeout(() =>{
                    this.zipcode = input.target.value;
                    if(this.zipcode){
                        localStorage.setItem('cookiezip', this.zipcode);
                        this.loadLocationZip();
                    }
                }, 750)
            }
        }
    }

    changeUnits(){
        if(this.unit == "fahrenheit"){
            localStorage.setItem('unit', 'celcius');
            this.unit = 'celcius';
            this.loadweatherZip();
        }
        else{
            localStorage.setItem('unit', 'fahrenheit');
            this.unit = 'fahrenheit';
            this.loadweatherZip();
        }
        this.checkBox();
    }

    update(){
        this.temperature = this.weather.current.temp;
        this.feels = this.weather.current.feels_like;
        this.humidity = this.weather.current.humidity;
        this.description = this.weather.current.weather[0].description;
        this.main = this.weather.current.weather[0].main;
        this.high = this.weather.daily[0].temp.max;
        this.low = this.weather.daily[0].temp.min;
        this.ws = this.weather.current.wind_speed;
        let date = new Date();
        this.date = date.toLocaleDateString() + " " + date.toLocaleTimeString('en-US');
        this.precipitation = (this.weather.hourly[0].pop * 100).toFixed(0);
        let tz = this.weather.timezone;
        this.sunRise = new Date(this.weather.current.sunrise * 1000).toLocaleTimeString('en-US',{
            hour: 'numeric', minute: 'numeric', hour12: true, timeZone: tz
        });
        this.sunSet = new Date(this.weather.current.sunset * 1000).toLocaleTimeString('en-US',{
            hour: 'numeric', minute: 'numeric', hour12: true, timeZone: tz
        });
        this.checkBox();
        this.loaded = true;
        setTimeout(() => {this.loaded = false;}, 1);
        this.loadIcon(this.weather.current.weather[0].icon);
    }

    getLoc(){
        const sucessCall = (position) => {
            document.cookie = position.coords.latitude + "," + position.coords.longitude;
            this.getLocation();
            this.loadweather();
        }
        const errorCall = (error) => {
            console.error(error);
        }
        navigator.geolocation.getCurrentPosition(sucessCall, errorCall);
    }

    clearZip(){
        this.zipcode = "";
    }

    async loadweather(){
        let pos = decodeURIComponent(document.cookie).split(",");
        this.lat = pos[0];
        this.lon = pos[1];
        if(this.unit == "celcius"){
            this.getData('metric');
        }
        else{
            this.unit == "fahrenheit"
            this.getData('imperial');
        }
    }

    async loadLocation(){
        var decodedCookie = decodeURIComponent(document.cookie);
        this.pos = decodedCookie;
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.pos}&key=${this.geoKey}`);
        let loc = await response.json();
        for(let x = 0; x < loc.results.length; x++){
            if(loc.results[x].formatted_address.match(/^[a-zA-Z]+[, ]+[A-Z]{2}\s\d{5}[, ]\s\w{3}$/)){
                this.location = loc.results[x].formatted_address;
                return
            }
        }   
    }

    async loadweatherZip(){
        if(this.unit == "fahrenheit"){
            this.getData('imperial');
        }
        else{
            this.getData('metric');
        }
    }

    async loadLocationZip(){
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.zipcode}&key=${this.geoKey}`);
        let loc = await response.json();  
        this.lat = loc.results[0].geometry.location.lat;
        this.lon = loc.results[0].geometry.location.lng;
        this.location = loc.results[0].formatted_address;
        this.loadweatherZip();
    }

    async getLocation(){
        var decodedCookie = decodeURIComponent(document.cookie);
        this.pos = decodedCookie;
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.pos}&key=${this.geoKey}`);
        let loc = await response.json();
        for(let x = 0; x < loc.results.length; x++){
            if(loc.results[x].formatted_address.match(/^[a-zA-Z]+[, ]+[A-Z]{2}\s\d{5}[, ]\s\w{3}$/)){
                this.location = loc.results[x].formatted_address;
                let geoLoc = this.location.split(',');
                this.zipcode = geoLoc[0];
                localStorage.setItem('cookiezip', this.zipcode)
                return
            }
        }   
    }

    checkBox(){
        if(this.unit == "fahrenheit" || this.unit == null){
            document.querySelector('.slider').classList.remove('c');
            document.querySelector('.slider').classList.add('f');
        }
        if(this.unit == "celcius"){
            document.querySelector('.slider').classList.remove('f');
            document.querySelector('.slider').classList.add('c');
        }       
    }
    
    loadIcon(value){
        var skycons = new Skycons({"monochrome": false});
        const isEvening = new Date().getHours();
        if(this.weather.current.weather[0].id > 614 && this.weather.current.weather[0].icon < 623){
            value = value + "RS";
        }
        if(isEvening >= 16 || isEvening <= 20){
            let value2 = value;
            value = value + "Evening";
            var cond = this.weatherDesc.get(value)
            if(!cond){
                var cond = this.weatherDesc.get(value2)
            }
        }
        else{
            var cond = this.weatherDesc.get(value)
        }       
        skycons.add("iconCurrent", cond);
        skycons.play();
    }

    async getData(unit){
        let response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.lon}&appid=${this.weatherKey}&units=`+unit);
        this.weather = await response.json();
        this.update();
    }
}