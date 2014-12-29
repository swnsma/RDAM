/**
 * Created by Таня on 28.12.2014.
 */
function AppViewModel() {
    var self=this;
    self.user={
        array: ko.observableArray([])
    }
    self.page={
        type: ko.observable(0),
        click:{

        }
    }
    self.page.click.to_p1=function(){
        self.current_user(new User_class())
        self.page.type(1);
    }
    self.page.click.to_p2=function(root){
        self.current_user(new User_class(root.id,root.name,
            root.color,root.city,root.photo,root.desc));
        self.page.type(2);
    }
    self.page.click.to_p3=function(root){
        debugger;
        self.page.type(3);
    }
    self.current_user=ko.observable();
}

// Activates knockout.js
$(document).ready(function () {
    var appVievM = new AppViewModel();
    ko.applyBindings(appVievM);
    debugger;
    getUsers(appVievM.user.array, analyze_function);
})
function User_class(id,name,color,city,photo,desc){
    this.id=id;
    this.name=name;
    this.color=color;
    this.city=city;
    this.photo=photo;
    this.desc=desc;
}
function analyze_function(response,self){
    if (response && response.data && response.data.length) {
        var mappedTasks = [];
        for (var i = 0; i < response.data.length; i++)
        {
            var a = response.data[i];
            var j = i % masColor.length;
            var b = new User_class(a.id,a.user,masColor[j],a.city, a.photo, a.descr);
            mappedTasks.push(b);
        }
        self(mappedTasks);
    }
}

