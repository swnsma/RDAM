function WeatherApi() {
    var key = '5014b616aa426e0a5a01ccf7ebc3d';

    this.getWeather = function(funcSuccess, funcError) {
        $.ajax({
            url: 'http://api.worldweatheronline.com/free/v2/weather.ashx?q=London&format=json&num_of_days=5&key=' + key,
            type: 'GET',
            contentType: 'application/json',
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
        s: this,
        humidity: ko.observable(),
        precipMM: ko.observable(),
        pressure: ko.observable(),
        winddirDegree: ko.observable(),
        windspeedMiles: ko.observable(),
        hourly: ko.observableArray([]),
        tempC: ko.observable(),
        tempF: ko.observable(),
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

    function renderData(data) {
        data = data.data;
        $('#loading').remove();

        function getHourly(h) {
            var hourly = [];
            for(var i in h) {
                var el = h[i];
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

        var curr = data.current_condition[0];
        self.weather_days.push({
            active: ko.observable(false),
            date: data.weather[0].date,
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
                date: data[i].date,
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

        $('#weather-list').css('display', 'block');
    }

    var api = new WeatherApi();
    api.getWeather(renderData, function() { alert('error'); });
}

$(document).ready(function() {
    ko.applyBindings(new WeatherModel(), document.getElementById('weather-list'));
});
