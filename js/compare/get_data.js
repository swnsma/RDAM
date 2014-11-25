/**
 * Created by User on 24.11.2014.
 */
function get_data(clas) {
    var options = {
        url: 'https://api.parse.com/1/classes/'+clas,
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('X-Parse-Application-Id', 'dEruvPYiXg1FAzhn4u47ZP8Yjd7B2Ss6Gqjqi7h3');
            request.setRequestHeader('X-Parse-REST-API-Key', 'a6npew12pgZaQJSTeCtPru3cVGS9VmZzG1op4mK8');
        },
        success: function (response) {
            if (response && response.results && response.results.length) {
                var allData=[]
                for (var i = 0; i < response.results.length; i++) {
                    var a = response.results[i];
                    allData.push(a);
                }
                //alert("ok");
                users_data[index]=allData;
                index++;
                //debugger;
                if(index<length_l)
                get_data(all[index].name_table);
                else{
                    index=0;
                    render();
                }
            }
        },

        error: function () {
            alert("not ok");  return NULL;
        }
    };
    $.ajax(options);
};