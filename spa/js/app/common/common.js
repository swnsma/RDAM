
var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");
var monthes=['January','February', 'March','April','May','June','July','August','September','October','November','December'];

function day(a,b) {
    var c=+b;
    return a+" "+monthes[c-1].slice(0,3)+".";
}

function LoadingManager() {
    this.enable = function() {
        $('#loading').css('display', 'block');
        $('#data').css('display', 'none');
    };

    this.disable = function() {
        $('#loading').css('display', 'none');
        $('#data').css('display', 'block');
    };
}

function UserInfo(id, name, city, photo, descr) {
    this.id = id;
    this.user = name;
    this.city = city;
    if (photo) {
        this.photo = 'cdn/users/' + photo;
    } else {
        this.photo = 'cdn/general/default_avatar.jpg';
    }
    this.descr = descr;
}

function ScriptManager() {
    var classes = [];
    var first_func = function(func) { func(); }; //асинхронная
    var last_func = function() {};

    this.add = function(cl) {
        if (typeof cl == 'function') {
            classes.push(cl);
        }
    };

    this.initFirstFunc = function(func) {
        if (typeof func == 'function') {
            first_func = func;
        }
    };

    this.initLastFunc = function(func) {
        if (typeof func == 'function') {
            last_func = func;
        }
    };

    this.init = function() {
        $(document).ready(function() {
            var c = classes;
//            try {
                first_func(function() {
                    for(var i in c) {
                        new c[i];
                    }
                    last_func();
                });
//            } catch(e) {
//                console.log('ERROR: ' + e.message);
//            } finally {
//                classes = [];
//                first_func = function(func) { func(); };
//                last_func = function() {};
//            }
        });
    };
}

function CurrentUser() {
    var info = new UserInfo();

    this.getId = function() {
        return info.id;
    };

    this.getName = function() {
        return info.user;
    };

    this.getCity = function() {
        return info.city;
    };

    this.getPhoto = function() {
        return info.photo;
    };

    this.getDescr = function() {
        return info.descr;
    };

    function processData(data) {
        info = new UserInfo(data.id, data.user, data.city, data.photo, data.descr);
        changeMenu(info.id)
    }

    function saveData() {
        window.localStorage.setItem('curr_user_info', JSON.stringify(info));
    }

    function changeMenu(id) {
        $('#menu > li').each(function() {
            $(this).children()[0].hash = id;
        });
    }

    function getInfoByUser(id, funcSuccess, funcError) {
        $.ajax({
            url: 'http://195.69.221.236/ajax/user_info.php?id=' + id  + '&fields=city,photo,descr',
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

    this.selectCurrentUser = function(func) {
        var id = getUserDefined();
        if (id == null) {
            id = 1; //prompt('What is the current user id?', 1);

            getInfoByUser(id, function(response) {
                window.location.hash = id;
                processData(response.data[0]); //temp index array
                saveData();
                func();
            }, function() {
                alert('error getting user info');
            });

        } else {
            var data = window.localStorage.getItem('curr_user_info');
            if (data === null) {
                alert('data user undefined');
            } else {
                processData(JSON.parse(data));
                if (info.id != id) {

                    getInfoByUser(id, function(response) {
                        processData(response.data[0]); //temp index array
                        saveData();
                        func();
                    }, function() {
                        alert('error getting user info');
                    });

                } else {
                    func();
                }
            }
        }
    };

    function getUserDefined() {
        var id = window.location.hash.substring(1);
        if (id == parseInt(id)) {
            return id;
        } else {
            return null;
        }
    }
}

var loading = new LoadingManager();
var current_user = new CurrentUser();
var manager = new ScriptManager();
$(window).bind('hashchange', function() {
    location.reload();
});
manager.initFirstFunc(current_user.selectCurrentUser);
manager.init();