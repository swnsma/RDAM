
function AppViewModelAbout(current){
    var self= this;
    self.userName = ko.observable(current.user);
    self.desc = current.descr;
    self.img =window.app.url+"/cdn/users/"+ current.photo;
    self.textTweet = ko.computed(function(){
        return self.userName()+" helps to make the planet green! See more details at "+window.location;
    });
}
