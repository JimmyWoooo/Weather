import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class WeeklyComponent extends Component {
    @tracked weather;
    @tracked unit;
    @tracked weatherDesc;
    weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(){
        super(...arguments);
        this.weather = this.args.weatherWeekly;
        this.unit = this.args.unit;
        this.weatherDesc = this.args.weatherDesc;
        this.createDiv();
    }

    createDiv(){
        if(!document.getElementById('weekly')){
            var el = document.createElement("div");
            el.setAttribute("id", "weekly");
            document.body.appendChild(el);
        }
        let tp = document.getElementById('weekly');
        tp.innerHTML = "<div id=\"wData\">"
        this.printData(0);
        this.displayWeekly()
    }

    displayWeekly(){
        for(let x = 1; x < 7; x++){
            this.printData(x)
        }
        this.printData(7)
        for(var x = 0; x < 8; x++){
            this.loadIcon(this.weather.daily[x].weather[0].icon, 'iconW' + x, x)
        }
        let tp = document.querySelector('#weekly');
        tp.removeEventListener('wheel', () =>{

        })
        tp.addEventListener('wheel', (e) => {
            tp.scrollLeft += e.deltaY/1.5;
        });
    }

    printData(value){
        let tz = this.weather.timezone;
        let tp = document.getElementById('wData');
        tp.innerHTML += "<div class=\"days\"><div id=\"updated\">" + new Date(this.weather.daily[value].dt * 1000).toLocaleDateString('en-US')
        +"</div><div class=\"wDay\">" + this.weekDays[(this.returnDate() + value) % 7] + 
        "</div><canvas id=\"iconW" + value + "\" width=\"100\" height=\"100\"></canvas><div>Morning - " + 
        this.weather.daily[value].temp.morn + " " + this.unit + "</div><div>Noon - " + 
        this.weather.daily[value].temp.day + " " + this.unit +"</div><div>Night - " + 
        this.weather.daily[value].temp.night + " " + this.unit + "</div><div>Percipitation - " + 
        (this.weather.daily[value].pop * 100).toFixed(0) + "%</div><div>Humidity - " +
        this.weather.daily[value].humidity + "%</div><div>Sunrise - " + 
        new Date(this.weather.daily[value].sunrise * 1000).toLocaleTimeString('en-US',{
            hour: 'numeric', minute: 'numeric', hour12: true, timeZone: tz
        }) + "</div><div>SunSet - " + new Date(this.weather.daily[value].sunset * 1000).toLocaleTimeString('en-US',{
            hour: 'numeric', minute: 'numeric', hour12: true, timeZone: tz
        }) +  "</div></div>";
    }

    loadIcon(value, icon, day){
        var skycons = new Skycons({"monochrome": false});
        const isEvening = new Date().getHours();
        var cond = this.weatherDesc.get(value)
        if(this.weather.daily[day].weather[0].id > 614 && this.weather.daily[day].weather[0].id < 623){
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

    returnDate(){
        let date = new Date();
        return date.getDay()
    }
}
