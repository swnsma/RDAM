function Product() {
    getData();

    setTimeout(function() {
        changeGraph(1);
    }, 1000);

    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');

    button_constr($dayButton, $target, 1,'Days');
    button_constr($weekButton, $target, 2,'Weeks');
    button_constr($monthButton, $target, 3,'Months');

}

$(document).ready(function() {
    new Product();
});