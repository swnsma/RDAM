
$(document).ready(function () {
    getData();
    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    $dayButton.appendTo($target)
        .appendTo($target)
        .addClass('time')
        .addClass("first")
        .text('Days')
        .click(function () {
            $("#co2").html(0.61*sum_days+" kg");
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            changeGraph(1);
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") })
        .addClass("is_active");
    var $weekButton = $('<div>');
    $weekButton
        .appendTo($target)
        .addClass('time')
        .text('Weeks')
        .click(function () {
            changeGraph(2);
            $("#co2").html(0.61*sum_weeks+" kg");
            $(this).addClass("is_active");

            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") });
    var $monthButton = $('<div>');
    $monthButton
        .appendTo($target)
        .addClass('time')
        .text('Months')
        .click(function () {
            changeGraph(3);
            $("#co2").html(0.61*sum_month+" kg");
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") });


});