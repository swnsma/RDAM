(function(){
    var a=$('meta', 'head');
    for(var i=0; i< a.length; i++)
    {
        if(a[i].content=='http://rdam.zz.mu/img/ForShare.png')
        {
            console.log(a[i].content);
            a[i].content= window.location.protocol+'//'+window.location.host+'/img/ForShare.png';
            console.log(a[i].content);
        }
        if(a[i].content=='http://rdam.zz.mu/production.html')
        {
            console.log(a[i].content);
            a[i].content=window.location.protocol+'//'+window.location.host+window.location.pathname;
            console.log(a[i].content);
        }
    }
    $('.fb-share-button', '#fb-root').attr({'data-href':window.location.href});
    fb(document, 'script', 'facebook-jssdk');
})();

    function fb(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
    fjs.parentNode.insertBefore(js, fjs);
}


