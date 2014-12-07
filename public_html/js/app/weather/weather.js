function WeatherApi(city) {
    var key = '5014b616aa426e0a5a01ccf7ebc3d';

    this.getWeather = function(funcSuccess, funcError) {
        $.ajax({
            url: 'http://api.worldweatheronline.com/free/v2/weather.ashx?q=' + city + '&format=json&num_of_days=5&key=' + key,
            type: 'GET',
            contentType: 'application/json',
            complete: function() {
                loading.disable();
            },
            success: function (response) {
                if (response) {
                    funcSuccess(response);
                } else {
                    funcError();
                }
            },
            error: funcError
        });
    }
}


function WeatherModel() {
    var self = this;

    self.weather_days = ko.observableArray([]);

    var current_active = 0;

    self.weather_days_mi = {
        humidity: ko.observable(),
        precipMM: ko.observable(),
        pressure: ko.observable(),
        winddirDegree: ko.observable(),
        windspeedMiles: ko.observable(),
        hourly: ko.observableArray([]),
        tempC: ko.observable(),
        tempF: ko.observable()
    };

    self.renderMoreInfo = function(n) {
        self.weather_days()[current_active].active(false);
        self.weather_days()[n].active(true);
        current_active = n;

        var el = self.weather_days()[current_active];
        self.weather_days_mi.hourly(el.hourly);
        self.weather_days_mi.tempC(el.tempC);
        self.weather_days_mi.tempF(el.tempF);
    };

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    function getDate(date) {
        var d = new Date(date.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
        return {
            day_name: days[d.getDay()],
            is_day_off: (d.getDay() == 0 || d.getDay() == 6) ? true : false,
            day: d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
            month_name: months[d.getMonth()]
        };
    }

    function getHourly(h) {
        var hourly = [];
        for(var k in h) {
            var el = h[k];
            hourly.push({
                weatherDesc: el.weatherDesc[0].value,
                weatherIconUrl: el.weatherIconUrl[0].value,
                tempC: el.tempC,
                tempF: el.tempF,
                humidity: el.humidity,
                precipMM: el.precipMM,
                pressure: el.pressure,
                winddirDegree: el.winddirDegree,
                windspeedMiles: el.windspeedMiles
            });
        }
        return hourly;
    }

    function getMaxTemp(h) {
        return { maxtempC: h.maxtempC, maxtempF: h.maxtempF, mintempC: h.mintempC, mintempF: h.mintempF };
    }

    function renderData(data) {
        data = data.data;

        var curr = data.current_condition[0];
        self.weather_days.push({
            active: ko.observable(false),
            date: getDate(data.weather[0].date),
            weatherDesc: curr.weatherDesc[0].value,
            weatherIconUrl: curr.weatherIconUrl[0].value,
            tempC: curr.temp_C,
            tempF: curr.temp_F,
            humidity: curr.humidity,
            precipMM: curr.precipMM,
            pressure: curr.pressure,
            winddirDegree: curr.winddirDegree,
            windspeedMiles: curr.windspeedMiles,
            hourly: getHourly(data.weather[0].hourly),
            maxnimtemp: getMaxTemp(data.weather[0])
        });

        data = data.weather;
        for(var i = 1; i < data.length; ++i) {
            curr = data[i].hourly[0];
            self.weather_days.push({
                active: ko.observable(false),
                date: getDate(data[i].date),
                weatherDesc: curr.weatherDesc[0].value,
                weatherIconUrl: curr.weatherIconUrl[0].value,
                tempC: curr.tempC,
                tempF: curr.tempF,
                humidity: curr.humidity,
                precipMM: curr.precipMM,
                pressure: curr.pressure,
                winddirDegree: curr.winddirDegree,
                windspeedMiles: curr.windspeedMiles,
                hourly: getHourly(data[i].hourly),
                maxnimtemp: getMaxTemp(data[i])
            });
        }

        self.renderMoreInfo(current_active);
    }

    var api = new WeatherApi(current_user.getCity());
    api.getWeather(function(data) {
        try {
            renderData(data);
        } catch(e) {
            alert('invalid city');
        }
    }, function() { alert('error'); });
}

function Weather() {
    ko.applyBindings(new WeatherModel(), document.getElementById('weather-list'));
}

manager.add(Weather);
