function Product() {
    getData();
    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');
    button_constr($monthButton, $target, 3);
    button_constr($dayButton, $target, 1);
    button_constr($weekButton, $target, 2);
}

manager.add(Product);