import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
//import { metric } from 'weather/helpers/metric';

export default class HourlyComponent extends Component {
    @tracked weather;
    @tracked unit;
    @tracked weatherDesc;

    constructor(){
        super(...arguments);
        this.weather = this.args.weatherHourly;
        this.unit = this.args.unit;
        this.weatherDesc = this.args.weatherDesc;
        this.createDiv();
    }
    
    createDiv(){
        if(!document.getElementById('hourly')){
            var el = document.createElement("div");
            el.setAttribute("id", "hourly");
            document.body.appendChild(el);
        }
        this.displayHourly();
    }

    displayHourly(){
        let tp = document.getElementById('hourly');
        tp.innerHTML = "<div id=\"stick\"><div id=\"stickyTime\">Time</div><div id=\"stickyTemp\">Temp</div>" + 
        "<div id=\"stickyHumid\">Humidity</div><div id=\"stickyCond\">Condition</div>" + 
        "</div><div id=\"data\"></div>";
        this.displayData();
    }

    displayData(){
        let tp = document.getElementById('data');
        for(var x = 0; x < 24; x++){
            tp.innerHTML = tp.innerHTML + "<details><summary class=\"HrSummary\"><div class=\"HrDate\">" 
            + this.getDate(x) +"</div><div class=\"HrTemp\">" + this.weather.hourly[x].temp + " " 
            + this.unit + "</div><div class=\"HrHumid\">" + this.weather.hourly[x].humidity + 
            "%</div><canvas id=\"iconH" + x + "\" width=\"35\" height=\"35\"></canvas>" + 
            "</div></summary><div class=\"details\"><div class=\"detail-container\"><div>Feels Like: " + this.weather.hourly[x].feels_like +
            " " + this.unit + "</div><div>Description: " + this.weather.hourly[x].weather[0].description +
            "</div><div>Windspeed: "+ this.weather.hourly[x].wind_speed + " " + 
            this.metric() +"</div><div>Precipitation: " + (this.weather.hourly[x].pop * 100).toFixed(0) +
            " %</div></div></div></details>";
        }
        for(var x = 0; x < 24; x++){
            this.loadIcon(this.weather.hourly[x].weather[0].icon, 'iconH' + x, x)
        }
        if(tp.addEventListener){
            tp.addEventListener('scroll', function(e){
                localStorage.setItem("scrollY", e.target.scrollTop);
            });}
        if(localStorage.getItem("scrollY") != null){
            tp.scrollTop = localStorage.getItem("scrollY");
        }
    }

    loadIcon(value, icon, hour){
        var skycons = new Skycons({"monochrome": false});
        const isEvening = new Date().getHours();
        var cond = this.weatherDesc.get(value)
        if(this.weather.hourly[hour].weather[0].id > 614 && this.weather.hourly[hour].weather[0].id){
            value = value + "RS";
        }
        if(isEvening >= 16 || isEvening <= 20){
            value = value + "Evening";
            var newCond = this.weatherDesc.get(value)
            if(newCond){
                skycons.set(icon, newCond);
            }
            else
            skycons.set(icon, cond);
        }
        else{
            skycons.set(icon, cond);
        }
        skycons.play();
    }

    metric(){
        let unit = localStorage.getItem('unit');
        if(unit == 'celcius' || unit == null){
          return 'm/s';
        }
        else
        return 'Mph';
    }

    getDate(value){
        let tz = this.weather.timezone;
        var date = new Date(this.weather.hourly[value].dt * 1000).toLocaleTimeString('en-US',{
            hour: 'numeric', minute: 'numeric', hour12: true, timeZone: tz
        });
        return date;
    }
}
