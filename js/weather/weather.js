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
                }
            },
            error: funcError
        });
    }
}

function WeatherModel() {

    var self = this;
    self.weather_days = ko.observableArray([]);

    function renderData(data) {
        var weather = data.data.weather;
        alert(weather.length);
        for(var i in weather) {
            self.weather_days.push({
                date: weather[i].date
            })
        }
    }


    var api = new WeatherApi();
    api.getWeather(renderData, function() { alert('error'); });
}

$(document).ready(function() {
    ko.applyBindings(new WeatherModel(), document.getElementById('weather-list'));
});