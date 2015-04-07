//preloads some info

//global variables
var months = ['January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'];
var monthsShort = ['Jan', 'Feb', 'Mar',
    'Apr', 'May', 'June', 'July',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'];
var colors = [{ color: '#737373', used: false },
    { color: '#4986e7', used: false },
    { color: '#16a765', used: false },
    { color: '#e9b330', used: false },
    { color: '#a479e2', used: false }];
var dataLoaded = false;//will be changed by getAllInfoAllUsers() or by getMinimalInfo()
var useRandom = false;
var currentUserId;
var currentUserN;

//graph drawing thing
//wraper - DOM object, graph's canvas will be placed in it
function drawGraph(wrapper, desc) {
    if (desc == 0) {
        return;
    }
    if (desc.dataSets.length == 0) {
        return;
    }
    var width;
    var height;
    var fontFamily = 'calibry';

    var hoverEventCanvas;
    var eventHoverCtx;
    var canvas;

    initializeGraph();

    var fontSize;
    var graphTop;
    var graphBottom;
    var graphHeight;

    var minDate;
    var maxDate;
    var dateRange;
    var dates;

//contains information about time intervals {endDate: date; x: number}
    var xIntervals = [];

    var yScaleFactor;
    var minValue;
    var maxValue;
    var horGridStep;
    var horGridStepMs;
    var verGridStep;
    var globalXOffset;
    var graphCtx = canvas.getContext('2d');

    calculateRange();
    calculateSpace();
    drawHorLines();
    drawDateLabels();
    drawDataSets();
    drawHorLabels();

    function initializeGraph() {
        width = wrapper.clientWidth;
        height = width * 0.35;
        wrapper.clientHeight = height;
        wrapper.style.position = "relative";
        fontFamily = 'calibry';

        //removes all child elements of wrapper
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }

        hoverEventCanvas = document.createElement("canvas");
        hoverEventCanvas.id = 'hoverEventCanvas';
        hoverEventCanvas.width = width;
        hoverEventCanvas.height = height;
        hoverEventCanvas.style.position = "absolute";
        hoverEventCanvas.style.zIndex = "1";
        hoverEventCanvas.style.top = "0";
        hoverEventCanvas.style.left = "0";
        wrapper.appendChild(hoverEventCanvas);
        eventHoverCtx = hoverEventCanvas.getContext("2d");
        eventHoverCtx.fillStyle = "#fff";

        canvas = document.createElement("canvas");
        canvas.id = 'productionGraph';
        canvas.style.position = "relative";
        canvas.style.zIndex = "0";
        canvas.width = width;
        canvas.height = height;
        canvas.style.cursor = 'pointer';
        hoverEventCanvas.addEventListener('mousemove', mouseMove, true);
        hoverEventCanvas.addEventListener('mouseleave', mouseLeave);
        hoverEventCanvas.addEventListener('click', mouseClick);

        wrapper.appendChild(canvas);
    }
    function calculateRange() {
        if(desc.dataSets[0][0]===undefined){
            return;
        }
        minDate = desc.dataSets[0][0].date;
        maxDate = desc.dataSets[0][0].date;
        for (var set in desc.dataSets) {
            for (var val in desc.dataSets[set]) {
                if (desc.dataSets[set][val].date < minDate) {
                    minDate = desc.dataSets[set][val].date;
                }
                if (desc.dataSets[set][val].date > maxDate) {
                    maxDate = desc.dataSets[set][val].date;
                }
            }
        }
        dateRange = maxDate - minDate;
        switch (desc.scale) {
            case 'dayInterval': {
                horGridStepMs = 86400000;
                globalXOffset = 0;
                dates = dateRange / horGridStepMs + 1;
                horGridStep = width / dates;
                break;
            }
            case 'weekInterval': {
                horGridStepMs = 86400000 * 7;
                dates = dateRange / horGridStepMs + 1;
                horGridStep = width / dates;
                globalXOffset = horGridStep / 2;
                break;
            }
            case 'monthInterval': {
                horGridStepMs = 86400000;
                globalXOffset = 0;
                dates = dateRange / horGridStepMs + 1;
                horGridStep = width / dates;
                break;
            }
        }
    }
    function calculateSpace() {
        fontSize = height / 20;
        graphTop = 4 * fontSize;
        graphBottom = height - fontSize * 3;
        graphHeight = graphBottom - graphTop;

        //find max value for all data sets
        maxValue = desc.dataSets[0][0].value;

        minValue = maxValue;
        for (var set in desc.dataSets) {
            for (var i in desc.dataSets[set]) {
                var value = desc.dataSets[set][i].value;
                if (value > maxValue) {
                    maxValue = value;
                }
                if (value < minValue) {
                    minValue = value;
                }
            }
        }

        yScaleFactor = graphHeight / (maxValue - minValue);
        var minStep = graphHeight / 6;
        var step = 0.01;
        for (; ;) {
            step *= 2.5;
            if (step * yScaleFactor >= minStep) {
                break;
            }
            step *= 2;
            if (step * yScaleFactor >= minStep) {
                break;
            }
            step *= 2;
            if (step * yScaleFactor > minStep) {
                break;
            }
        }
        verGridStep = step;
        minValue = Math.floor(minValue / step) * step;
        yScaleFactor = graphHeight / (maxValue - minValue);
    }
    function drawDataSets() {
        for (var set in desc.dataSets) {
            drawDataSet(desc.dataSets[set], desc.colors[set]);
        }
    }
    function drawDataSet(set, color) {
        graphCtx.beginPath();
        graphCtx.strokeStyle = color;
        graphCtx.lineWidth = 3;
        for (var i in set) {
            graphCtx.textAlign = 'right';
            var x = (set[i].date - minDate) * width / dateRange;
            var y = (set[i].value - minValue) * graphHeight / (maxValue - minValue);
            if (i == 0) {
                graphCtx.moveTo(x, graphBottom - y);
            } else {
                graphCtx.lineTo(x, graphBottom - y);
            }
        }
        graphCtx.stroke();
    }
    function drawDateLabels() {
        switch (desc.scale) {
            case 'dayInterval': {
                drawDateLabelsDay();
                break;
            }
            case 'weekInterval': {
                drawDateLabelsWeek();
                break;
            }
            case 'monthInterval': {
                drawDateLabelsMonth();
                break;
            }
        }
    }
    function drawDateLabelsDay() {
        graphCtx.font = fontSize + 'px Calibri';
        graphCtx.strokeStyle = "#bebebd";


        createXIntervals();
        function createXIntervals() {
            var date = new Date(maxDate);

            xIntervals.push({ time: new Date(maxDate), x: width });

//find last millisecond of last day
            date.setDate(date.getDate() - 1);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            date.setMilliseconds(999);

            for (; date >= minDate; date.setDate(date.getDate() - 1)) {
                var x = (date - minDate) * width / dateRange;
                x = Math.round(x) + 0.5;
                xIntervals.unshift({ time: new Date(date), x: x });
            }
            for (var n in xIntervals) {
                var xR, widthR;
                var date1;
                var date2;
                var values = [];
                if (n == 0) {
                    xR = 0;
                    widthR = xIntervals[n].x
                    date1 = new Date(minDate);
                    date1.setHours(-1);
                    date2 = new Date(xIntervals[n].time);
                } else {
                    xR = xIntervals[n - 1].x;
                    widthR = xIntervals[n].x - xIntervals[n - 1].x
                    date1 = new Date(xIntervals[n - 1].time);
                    date2 = new Date(xIntervals[n].time);
                }
                for (var set in desc.dataSets) {
                    var value = {};
                    value.color = desc.colors[set];
                    value.value = sumByDateRange(desc.dataSets[set], date1, date2);
                    value.average = averageByDateRange(desc.dataSets[set], date1, date2);
                    values.push(value);
                }
                xIntervals[n].values = values;
            }
        }

        drawDays();
        function drawDays() {
            var monthDrawn = false;
            var g = graphCtx;
            g.textAlign = 'center';

            var x1 = 0;
            for (var i = 0; i < xIntervals.length; i++) {
                if (i > 0) {
                    x1 = xIntervals[i - 1].x;
                }
                var x2 = xIntervals[i].x;
                var y = graphBottom;
                g.beginPath();
                g.moveTo(x2, y);
                g.lineTo(x2, y + fontSize);
                g.closePath();

                var text = xIntervals[i].time.getDate();
                if (g.measureText(text).width < (x2 - x1)) {
                    g.fillText(text, (x1 + x2) / 2, y + fontSize + 2);
                }

                g.stroke();
                //check to draw year
                if (xIntervals[i].time.getDate() == 1) {
                    monthDrawn = drawMonthLabel(months[xIntervals[i].time.getMonth()], (x1 + x2) / 2);
                }
            }
            if (!monthDrawn) {
                graphCtx.fillText(months[xIntervals[0].time.getMonth()], width / 2, graphBottom + 2 * fontSize + 2);
                graphCtx.stroke();
            }
        }

        function drawMonthLabel(text, x) {
            graphCtx.textAlign = 'center';
            if ((width - x) < graphCtx.measureText(text).width / 2) {
                return false;
            }
            graphCtx.fillText(text, x, graphBottom + 2 * fontSize + 2);
            graphCtx.stroke();
            return true;
        }
    }
    function drawDateLabelsWeek() {
        graphCtx.font = fontSize + 'px Calibri';
        graphCtx.strokeStyle = "#bebebd";

        createXIntervals();
        function createXIntervals() {
            var date = new Date(maxDate);

            xIntervals.push({ time: new Date(maxDate), x: width });

            //find last millisecond of last sunday
            for (; date.getDay() != 1; date.setDate(date.getDate() - 1)) { }
            date.setDate(date.getDate() - 1);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            date.setMilliseconds(999);

            for (; date >= minDate; date.setDate(date.getDate() - 7)) {
                var x = (date - minDate) * width / dateRange;
                x = Math.round(x) + 0.5;
                xIntervals.unshift({ time: new Date(date), x: x });
            }
            for (var n in xIntervals) {
                var date1;
                var date2;
                var values = [];
                if (n == 0) {
                    xR = 0;
                    widthR = xIntervals[n].x
                    date1 = new Date(minDate);
                    date1.setHours(-1);
                    date2 = new Date(xIntervals[n].time).setMilliseconds(1000);
                } else {
                    xR = xIntervals[n - 1].x;
                    widthR = xIntervals[n].x - xIntervals[n - 1].x
                    date1 = new Date(xIntervals[n - 1].time).setMilliseconds(1000);
                    date2 = new Date(xIntervals[n].time);
                }
                for (var set in desc.dataSets) {
                    var value = {};
                    value.color = desc.colors[set];
                    value.value = sumByDateRange(desc.dataSets[set], date1, date2);
                    value.average = averageByDateRange(desc.dataSets[set], date1, date2);
                    values.push(value);
                }
                xIntervals[n].values = values;
            }
        }

        drawWeeks();
        function drawWeeks() {
            for (var i in xIntervals) {
                var x = xIntervals[i].x;
                var y = graphBottom;
                var g = graphCtx;
                g.beginPath();
                g.moveTo(x, y);
                g.lineTo(x, y - fontSize / 2);
                g.closePath();
                g.stroke();
            }
        }

        drawMonths();
        function drawMonths() {
            var monthsToDraw = [];//contains months' names and their coordinates

            var date = new Date(minDate);

            var month = {};
            month.n = date.getMonth();
            month.x = (date - minDate) * width / dateRange;
            monthsToDraw.push(month);

            for (; date < maxDate; date.setDate(date.getDate() + 1)) {
                if (date.getDate() == 1) {
                    var month = {};
                    month.n = date.getMonth();
                    month.x = (date - minDate) * width / dateRange;
                    monthsToDraw.push(month);
                }
            }

            date = new Date(maxDate);

            month = {};
            month.n = date.getMonth();
            month.x = (date - minDate) * width / dateRange;
            monthsToDraw.push(month);

            for (var m = 1; m < monthsToDraw.length ; m++) {
                var lX = monthsToDraw[m].x;
                var lY = graphBottom;
                lX = Math.round(lX) + 0.5;
                lY = Math.round(lY) + 0.5;
                graphCtx.beginPath();
                graphCtx.moveTo(lX, lY);
                graphCtx.lineTo(lX, lY + fontSize);
                graphCtx.closePath();
                graphCtx.stroke();
            }


            for (var i = 0; i < monthsToDraw.length - 1; i++) {
                var g = graphCtx;
                var x1 = monthsToDraw[i].x;
                var x2 = monthsToDraw[i + 1].x;
                var x = (x1 + x2) / 2;
                var space = x2 - x1;
                var monthText = months[monthsToDraw[i].n];
                if (g.measureText(monthText).width >= space) {
                    monthText = monthsShort[monthsToDraw[i].n];
                }
                if (g.measureText(monthText).width >= space) {
                    monthText = '';
                }

                var textWidth = g.measureText(monthText).width;
                var freeSpace = space - textWidth;

                g.textAlign = 'left';
                g.fillText(monthText, x1 + freeSpace / 2, graphBottom + fontSize + 2);
                g.stroke();
            }
        }
    }
    function drawDateLabelsMonth() {
        graphCtx.font = fontSize + 'px Calibri';
        graphCtx.strokeStyle = "#bebebd";
        graphCtx.textAlign = 'center';

        createXIntervals();
        function createXIntervals() {
            var date = new Date(maxDate);

            xIntervals.push({ time: new Date(maxDate), x: width });

            //find last millisecond of last month
            date.setDate(0);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            date.setMilliseconds(999);
            for (; date >= minDate;) {
                var x = (date - minDate) * width / dateRange;
                x = Math.round(x) + 0.5;
                xIntervals.unshift({ time: new Date(date), x: x });
                date.setDate(0);
            }

            for (var n in xIntervals) {
                var date1;
                var date2;
                var values = [];
                if (n == 0) {
                    date1 = new Date(minDate).setHours(-1);
                    date2 = new Date(xIntervals[n].time);
                } else {
                    date1 = new Date(xIntervals[n - 1].time);
                    date2 = new Date(xIntervals[n].time);
                }
                for (var set in desc.dataSets) {
                    var value = {};
                    value.color = desc.colors[set];
                    value.value = sumByDateRange(desc.dataSets[set], date1, date2);
                    value.average = averageByDateRange(desc.dataSets[set], date1, date2);
                    values.push(value);
                }
                xIntervals[n].values = values;
            }
        }

        drawMonths();
        function drawMonths() {
            for (var i in xIntervals) {
                var x = xIntervals[i].x;
                var y = graphBottom;
                var g = graphCtx;
                g.beginPath();
                g.moveTo(x, y);
                g.lineTo(x, y + fontSize / 2);
                g.closePath();
                g.stroke();
            }
        }

        drawMonthLabels();
        function drawMonthLabels() {
            var x1 = 0
            for (var i = 0; i < xIntervals.length; i++) {
                var x2 = xIntervals[i].x;
                if (i > 0) {
                    x1 = xIntervals[i - 1].x;
                }
                var text = months[xIntervals[i].time.getMonth()];
                if (graphCtx.measureText(text).width > (x2 - x1)) {
                    text = monthsShort[xIntervals[i].time.getMonth()];
                }
                if (graphCtx.measureText(text).width > (x2 - x1)) {
                    //text = xIntervals[i].time.getMonth() + 1;
                }
                if (graphCtx.measureText(text).width > (x2 - x1)) {
                    text = '';
                }
                graphCtx.fillText(text, (x1 + x2) / 2, graphBottom + fontSize);

                //check to draw year
                if (xIntervals[i].time.getMonth() == 0) {
                    drawYearLabel(xIntervals[i].time.getFullYear(), (x1 + x2) / 2);
                }
            }
        }

        function drawYearLabel(text, x) {
            graphCtx.textAlign = 'center';
            if ((width - x) < graphCtx.measureText(text).width / 2) {
                return;
            }
            graphCtx.fillText(text, x, graphBottom + 2 * fontSize + 2);
            graphCtx.stroke();
        }
    }
    function drawHorLines() {
        graphCtx.strokeStyle = "#bebebd";
        graphCtx.lineWidth = 1;
        graphCtx.beginPath();
        for (var i = graphBottom; i > 0; i -= verGridStep * yScaleFactor) {
            graphCtx.moveTo(0, Math.round(i) + 0.5);
            graphCtx.lineTo(width, Math.round(i) + 0.5);
        }
        graphCtx.stroke();
    }
    function drawHorLabels() {
        graphCtx.strokeStyle = "#bebebd";
        graphCtx.textAlign = 'left';
        graphCtx.font = fontSize + 'px Calibri';
        graphCtx.beginPath();
        var value = minValue;
        for (var i = graphBottom; i > 0; i -= verGridStep * yScaleFactor) {
            var text = (value).toFixed(2) * 1 + " kWh";
            if (fontSize > i) {
                break;
            }
            graphCtx.fillText(text, 5, i - 3);
            value += verGridStep;
        }
        graphCtx.stroke();
    }

    var selectedInterval = null;
    var pointedInterval = null;
    function mouseMove(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        if (isNaN(x) || isNaN(y)) {
            x = event.layerX;
        }

        var n = 0;
        for (var i = 1; i < xIntervals.length; i++) {
            if (x >= xIntervals[i - 1].x && x <= xIntervals[i].x) {
                n = i;
            }
        }
        pointedInterval = n;
        drawSelectedIntervals();
    }
    function mouseLeave() {
        pointedInterval = null;
        drawSelectedIntervals();
        applyIntervals();
    }
    function mouseClick() {
        if (pointedInterval == selectedInterval) {
            selectedInterval = null;
        } else {
            selectedInterval = pointedInterval;
        }
        applyIntervals();
    }
    function drawSelectedIntervals() {
        var xR;
        var widthR;

        //clear all
        eventHoverCtx.beginPath();
        eventHoverCtx.clearRect(0, 0, width, height);
        eventHoverCtx.fill();
        eventHoverCtx.closePath();

        //draw pointed interval
        if (pointedInterval != null) {
            var n = pointedInterval;
            if (n == 0) {
                xR = 0;
                widthR = xIntervals[n].x
            } else {
                xR = xIntervals[n - 1].x;
                widthR = xIntervals[n].x - xIntervals[n - 1].x
            }

            eventHoverCtx.beginPath();
            eventHoverCtx.fillStyle = 'rgba(255,255,255,0.7)';
            eventHoverCtx.rect(xR, 0, widthR, graphBottom);
            eventHoverCtx.fill();
            eventHoverCtx.closePath();

            drawValuesForInterval(n);
        }

        //draw selected interval
        if (selectedInterval != null) {
            var n = selectedInterval;
            if (n == 0) {
                xR = 0;
                widthR = xIntervals[n].x
            } else {
                xR = xIntervals[n - 1].x;
                widthR = xIntervals[n].x - xIntervals[n - 1].x
            }

            eventHoverCtx.beginPath();
            eventHoverCtx.fillStyle = 'rgba(255,255,255,0.7)';
            eventHoverCtx.rect(xR, 0, widthR, graphBottom);
            eventHoverCtx.fill();
            eventHoverCtx.closePath();
            drawValuesForInterval(n);
        }

    }
    function drawValuesForInterval(n) {
        var values = xIntervals[n].values;
        var textHeight = fontSize;
        var distance = textHeight; //distance between labels;
        var maxVal;
        var minVal;
        var x1;
        var x2;

        calculateSpace();
        function calculateSpace() {
            maxVal = xIntervals[0].values[0].average;
            minVal = xIntervals[0].values[0].average;
            for (var i in xIntervals) {
                for (var v in xIntervals[i].values) {
                    var val = xIntervals[i].values[v].average;
                    if (val > maxVal) {
                        maxVal = val;
                    }
                    if (val < minVal) {
                        minVal = val;
                    }
                }
            }
        }

        calculateCoordinates();
        function calculateCoordinates() {
            if (n == 0) {
                x1 = 0;
                x2 = xIntervals[0].x;
            } else {
                x1 = xIntervals[n - 1].x;
                x2 = xIntervals[n].x;
            }
            if ((x2 - x1) < (textHeight + 4)) {
                return;
            }
            for (var val in values) {
                var y = (values[val].average - minValue) * graphHeight / (maxValue - minValue);
                values[val].y = graphBottom - y;
            }

            //sorting
            for (var val1 in values) {
                for (var val2 in values) {
                    if (values[val1].y > values[val2].y) {
                        var temp = values[val1];
                        values[val1] = values[val2];
                        values[val2] = temp;
                    }
                }
            }
            var counter = 0;
            while (true) {
                var smthMoved = false;
                for (var val = 0; val < (values.length - 1) ; val++) {
                    var d = values[val].y - values[val + 1].y;
                    if (d < distance) {
                        var move = (distance - d) / 2 + 1;
                        values[val].y += move;
                        values[val + 1].y -= move;
                        smthMoved = true;
                    }
                }
                counter++;
                if (!smthMoved) {
                    break;
                }
                if (counter > 100) {
                    break;
                }
            }
        }

        drawValues();
        function drawValues() {
            eventHoverCtx.font = textHeight + 'px Calibri';
            for (var val in values) {
                var y = values[val].y;
                var squareSize = textHeight * 0.5;
                var width = x2 - x1 - squareSize - 4;
                var text = fitValue(width, values[val].value);
                var freeSpace = x2 - x1 - eventHoverCtx.measureText(text).width - squareSize - 6;
                eventHoverCtx.fillStyle = values[val].color;
                eventHoverCtx.fillRect(x1 + 2 + freeSpace / 2, y - squareSize / 2, squareSize, squareSize);
                eventHoverCtx.fillStyle = '#505050';
                eventHoverCtx.fillText(text, x1 + squareSize + 4 + freeSpace / 2, y + textHeight / 3);
            }
        }

        function fitValue(width, value) {
            var text = value.toFixed(2);
            if (eventHoverCtx.measureText(text).width > width) {
                text = value.toFixed(1);
            }
            if (eventHoverCtx.measureText(text).width > width) {
                text = value.toFixed(0);
            }
            if (eventHoverCtx.measureText(text).width > width) {
                text = '';
            }
            return text;
        }
    }
    function applyIntervals() {
        var dateStart;
        var dateEnd;
        var rangeSelected;
        function getDateRange(nI) {
            if (nI == 0) {
                dateStart = new Date(minDate);
                dateEnd = new Date(xIntervals[0].time);
                dateStart.setDate(-1);
            } else {
                dateStart = new Date(xIntervals[nI - 1].time);
                dateEnd = new Date(xIntervals[nI].time);
            }
        }

        if (selectedInterval == null) {
            dateStart = new Date(minDate);
            dateEnd = new Date(maxDate);
            rangeSelected = false;
        } else {
            getDateRange(selectedInterval);
            rangeSelected = true;
        }
        if (datesEqual(dateEnd, maxDate)) {
            dateEnd.setHours(23);
            dateEnd.setMinutes(59);
            dateEnd.setSeconds(59);
            dateEnd.setMilliseconds(999);
        }
        desc.applySelectedRange(dateStart, dateEnd, rangeSelected);
    }
}
function sumByDateRange(arr, dateStart, dateEnd) {
    var res = 0;
    for (var i = 0; i < arr.length; i++) {
        var d = arr[i].date;
        if ((d > dateStart) && (d <= dateEnd)) {
            res += arr[i].value;
        }
    }
    return res;
}
function averageByDateRange(arr, dateStart, dateEnd) {
    var res = 0;
    var n = 0;
    for (var i = 0; i < arr.length; i++) {
        var d = arr[i].date;
        if ((d > dateStart) && (d <= dateEnd)) {
            res += arr[i].value;
            n++;
        }
    }
    if (n == 0) {
        return res;
    } else {
        return res / n;
    }
}
function parseDate(date) {
    if (date.length < 9) {
        var month = date.substring(0, 3);
        month = getMonth(month);
        var year = date.substring(4, 8);
        year = parseInt(year);
        var JSDate = new Date(year, month);
        return JSDate;
    }
    var day = parseInt(date);
    var month = date.substring(3, 6);
    month = getMonth(month);
    var year = date.substring(7, 11);
    year = parseInt(year);
    var JSDate = new Date(year, month, day);
    JSDate.setHours(12);
    return JSDate;

    function getMonth(month) {
        var res;
        switch (month) {
            case 'Jan':
                res = 0;
                break;
            case 'Feb':
                res = 1;
                break;
            case 'Mar':
                res = 2;
                break;
            case 'Apr':
                res = 3;
                break;
            case 'May':
                res = 4;
                break;
            case 'Jun':
                res = 5;
                break;
            case 'Jul':
                res = 6;
                break;
            case 'Aug':
                res = 7;
                break;
            case 'Sep':
                res = 8;
                break;
            case 'Oct':
                res = 9;
                break;
            case 'Nov':
                res = 10;
                break;
            case 'Dec':
                res = 11;
                break;
        }
        return res;
    }
}
function datesEqual(d1, d2) {
    var res = true;
    res = res && (d1.getFullYear() == d2.getFullYear());
    res = res && (d1.getMonth() == d2.getMonth());
    res = res && (d1.getDate() == d2.getDate());
    res = res && (d1.getSeconds() == d2.getSeconds());
    res = res && (d1.getMilliseconds() == d2.getMilliseconds());
    return res;
}

//server interaction
//gathering all info about user and some info about all other users
var users = [];
function getMinimalInfo() {
    currentUserId = window.location.hash.substring(1); //gathering id from page's url
    getUsers();
    function getUsers() {
        var options = {
            url: window.app.url+'/ajax/users_info.php?from_id=' + 1 + '&&fields=city,photo,descr',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                processUsers(response);
                addUser(currentUserId);

            },
            error: function () {
                alert("Can't recieve users.");
            }
        };
        $.ajax(options);
    }
    function processUsers(response) {
        for (var user in response.data) {
            users[user] = new User();
            var ur = response.data[user];
            users[user].id = ur.id;
            users[user].name = ur.user;
            users[user].city = ur.city;
            users[user].info = ur.desc;
            users[user].image = ur.photo;
        }
    }
    function addUser(id) {
        var gotDay = false;
        var gotWeek = false;
        var gotMonth = false;

        var ids = id;

        getValues();
        function getValues() {
            getDayValues(18);
            getWeekValues(15);
            getMonthValues(17);
        }

        currentUserN = getUserNById(users, currentUserId);

        function getDayValues(n) {
            $.ajax({
                url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=day&limit=' + n,
                type: 'GET',
                contentType: 'application/json',
                beforeSend: function () { },
                success: function (response) {

                    processValuesDay(response);
                },
                error: function (xhr, status, error) { }
            });
        }
        function getWeekValues(n) {
            $.ajax({
                url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=week&limit=' + n,
                type: 'GET',
                contentType: 'application/json',
                beforeSend: function () { },
                success: function (response) {
                    console.log(response);
                    processValuesWeek(response);
                },
                error: function (xhr, status, error) { }
            });
        }
        function getMonthValues(n) {
            $.ajax({
                url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=month&limit=' + n,
                type: 'GET',
                contentType: 'application/json',
                beforeSend: function () { },
                success: function (response) {
                    processValuesMonth(response);
                },
                error: function (xhr, status, error) { }
            });
        }

        function processValuesDay(response) {
            for (var user in response.data.day) {
                var userN = getUserNById(users, response.data.day[user].id);
                if (response.data.day[user].values.length == 0) {
                    //if no enegry data for user we`ll fill it with zeros
                    users[userN].consumption.dayInterval = [new Value(0, new Date())];
                    users[userN].production.dayInterval = [new Value(0, new Date())];
                }

                for (var value in response.data.day[user].values) {
                    var val = response.data.day[user].values[value];
                    var date = val[0];
                    date = parseDate(date);
                    date.setHours(23);
                    var prod = parseFloat(val[1]);
                    var cons = parseFloat(val[2]);
                    var int = 'dayInterval';
                    users[userN].consumption[int].push(new Value(cons, date));
                    users[userN].production[int].push(new Value(prod, date))
                }
            }
            gotDay = true;
            if (gotDay && gotWeek && gotMonth) {
                users[userN].energyDataLoaded = true;
                dataLoaded = true;
            }
        }
        function processValuesWeek(response) {
            for (var user in response.data.week) {
                var userN = getUserNById(users, response.data.week[user].id);
                if (response.data.week[user].values.length == 0) {
                    //if no enegry data for user we`ll fill it with zeros
                    users[userN].consumption.weekInterval = [new Value(0, new Date())];
                    users[userN].production.weekInterval = [new Value(0, new Date())];
                }
                for (var value in response.data.week[user].values) {
                    var val = response.data.week[user].values[value];
                    var date = val[0];
                    date = parseDate(date);
                    date.setDate(date.getDate() - 1);
                    date.setHours(23);
                    var prod = parseFloat(val[1]);
                    var cons = parseFloat(val[2]);
                    var int = 'weekInterval';
                    users[userN].consumption[int].push(new Value(cons, date));
                    users[userN].production[int].push(new Value(prod, date))
                }
            }
            gotWeek = true;
            if (gotDay && gotWeek && gotMonth) {
                users[userN].energyDataLoaded = true;
                dataLoaded = true;
            }
        }
        function processValuesMonth(response) {
            for (var user in response.data.month) {
                var userN = getUserNById(users, response.data.month[user].id);
                if (response.data.month[user].values.length == 0) {
                    //if no enegry data for user we`ll fill it with zeros
                    users[userN].consumption.monthInterval = [new Value(0, new Date())];
                    users[userN].production.monthInterval = [new Value(0, new Date())];
                }
                for (var value in response.data.month[user].values) {
                    var val = response.data.month[user].values[value];
                    var date = val[0];
                    date = parseDate(date);
                    date.setMonth(date.getMonth() + 1);
                    date.setDate(-1);
                    date.setHours(23);
                    var prod = parseFloat(val[1]);
                    var cons = parseFloat(val[2]);
                    var int = 'monthInterval';
                    users[userN].consumption[int].push(new Value(cons, date));
                    users[userN].production[int].push(new Value(prod, date))
                }
            }
            gotMonth = true;
            if (gotDay && gotWeek && gotMonth) {
                users[userN].energyDataLoaded = true;
                dataLoaded = true;
            }
        }

        function getUserNById(array, id) {
            for (var i in array) {
                if (array[i].id == id) {
                    return i;
                }
            }
            return -1;
        }
    }
}
function loadUserById(self, id) {
    var data = new User();
    var gotDay = false;
    var gotWeek = false;
    var gotMonth = false;
    var userLoaded = false;
    var ids = id;
    var userN = getUserNById(users, id);
    getValues();
    function getValues() {
        self.dataLoaded(false);
        getDayValues(18);
        getWeekValues(15);
        getMonthValues(17);
    }

    currentUserN = getUserNById(users, currentUserId);

    function getDayValues(n) {
        $.ajax({
            url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=day&limit=' + n,
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function () { },
            success: function (response) {
                currentUserLastDay=response.data.day[0].values[0][0];
                processValuesDay(response);
            },
            error: function (xhr, status, error) { }
        });
    }
    function getWeekValues(n) {
        $.ajax({
            url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=week&limit=' + n,
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function () { },
            success: function (response) {
                currentUserLastWeek=response.data.week[0].values[0][0];
                console.log(currentUserLastWeek);
                processValuesWeek(response);
            },
            error: function (xhr, status, error) { }
        });
    }
    function getMonthValues(n){
        $.ajax({
            url: window.app.url+'/ajax/users_values.php?id=' + ids + '&todt=last&type=month&limit=' + n,
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function () { },
            success: function (response) {
                processValuesMonth(response);
            },
            error: function (xhr, status, error) { }
        });
    }

    function processValuesDay(response) {
        for (var user in response.data.day) {
            if (response.data.day[user].values.length == 0) {
                //if no enegry data for user we`ll fill it with zeros
                data.consumption.dayInterval = [new Value(0, new Date())];
                data.production.dayInterval = [new Value(0, new Date())];
            }
            for (var value in response.data.day[user].values) {
                var val = response.data.day[user].values[value];
                var date = val[0];
                date = parseDate(date);
                date.setHours(23);
                var prod = parseFloat(val[1]);
                var cons = parseFloat(val[2]);
                var int = 'dayInterval';
                data.consumption[int].push(new Value(cons, date));
                data.production[int].push(new Value(prod, date))
            }
        }
        gotDay = true;
        if (gotDay && gotWeek && gotMonth) {
            data.energyDataLoaded = true;
            userLoaded = true;
            replaceUser();
        }
    }
    function processValuesWeek(response) {
        for (var user in response.data.week) {

            if (response.data.week[user].values.length == 0) {
                //if no enegry data for user we`ll fill it with zeros
                data.consumption.weekInterval = [new Value(0, new Date())];
                data.production.weekInterval = [new Value(0, new Date())];
            }
            for (var value in response.data.week[user].values) {
                var val = response.data.week[user].values[value];
                var date = val[0];
                date = parseDate(date);
                date.setDate(date.getDate() - 1);
                date.setHours(23);
                var prod = parseFloat(val[1]);
                var cons = parseFloat(val[2]);
                var int = 'weekInterval';
                data.consumption[int].push(new Value(cons, date));
                data.production[int].push(new Value(prod, date))
            }
        }
        gotWeek = true;
        if (gotDay && gotWeek && gotMonth) {
            data.energyDataLoaded = true;
            userLoaded = true;
            replaceUser();
        }
    }
    function processValuesMonth(response) {
        for (var user in response.data.month) {
            if (response.data.month[user].values.length == 0) {
                //if no enegry data for user we`ll fill it with zeros
                data.consumption.monthInterval = [new Value(0, new Date())];
                data.production.monthInterval = [new Value(0, new Date())];
            }
            for (var value in response.data.month[user].values) {
                var val = response.data.month[user].values[value];
                var date = val[0];
                date = parseDate(date);
                date.setMonth(date.getMonth() + 1);
                date.setDate(-1);
                date.setHours(23);
                var prod = parseFloat(val[1]);
                var cons = parseFloat(val[2]);
                var int = 'monthInterval';
                data.consumption[int].push(new Value(cons, date));
                data.production[int].push(new Value(prod, date))
            }
        }
        gotMonth = true;
        if (gotDay && gotWeek && gotMonth) {
            data.energyDataLoaded = true;
            userLoaded = true;
            replaceUser();
        }
    }

    function replaceUser() {
        var u = self.users()[userN]();
        var nU = new User(data);
        u.consumption = nU.consumption;
        u.production = nU.production;
        u.energyDataLoaded = true;
        self.users()[userN](self.users()[userN]());
        self.dataLoaded(true);
    }

    function getUserNById(array, id) {
        for (var i in array) {
            if (array[i].id == id) {
                return i;
            }
        }
        return -1;
    }
}
function addUsers(self) {
    for (var u in users) {
        var data = users[u];
        self.users.push(ko.observable(new User(data)));
    }
    self.dataLoaded(true);
}

//some new types
function Value(value, date) {
    this.value = value; //float
    this.date = date; //JS Date object
}
function User(data) {
    if (!data) {
        this.name = '';
        this.info = '';
        this.image = '';
        this.color = '';
        this.energyDataLoaded = false;
        this.selected = ko.observable(false);
        this.mouseHover = ko.observable(false);

        this.consumption = {}
        this.production = {}

        this.consumption.dayInterval = [];
        this.production.dayInterval = [];

        this.consumption.weekInterval = [];
        this.production.weekInterval = [];

        this.consumption.monthInterval = [];
        this.production.monthInterval = [];
    } else { //copy constructor ('data' - another user)
        this.id = data.id;
        this.name = data.name;
        this.info = data.info;
        this.image = data.image;
        this.consumption = data.consumption;
        this.production = data.production;
        this.color = data.color;
        this.selected = ko.observable(data.selected());
        this.mouseHover = ko.observable(false);
        this.energyDataLoaded = data.energyDataLoaded;
    }
}

//custom bindings
ko.bindingHandlers.graph = {
    init: function (element, valueAccessor) {
        var desc = valueAccessor();
        var rawData = ko.unwrap(desc);
        drawGraph(element, rawData);
    },
    update: function (element, valueAccessor) {
        var desc = valueAccessor();
        var rawData = ko.unwrap(desc);
        drawGraph(element, rawData);
    }
}

//view model
function ViewModelScore() {
    var currentUserID = 1;
    var self = this;
    self.dataLoaded = ko.observable(false);
    self.working = ko.observable(true);//if true screen will be blocked
    self.users = ko.observableArray([]);

    if (useRandom) {
        addRandomUsers(self);
    } else {
        addUsers(self);
    }

    self.dataTypes = ko.observableArray(['production', 'consumption']);
    self.dataType = ko.observable(self.dataTypes()[0]);
    self.setDataType = function (type) {
        self.dataType(type);
    }
    self.scales = ko.observableArray([{ name: 'Day scale', index: 'dayInterval' }, { name: 'Week scale', index: 'weekInterval' }, { name: 'Month scale', index: 'monthInterval' }]);
    self.scale = ko.observable(self.scales()[0]);
    self.setScale = function (scale) {
        self.scale(scale);
    }
    self.currentUser = self.users()[0];
    self.selectedUsers = ko.computed(function () {
        var selected = 0;
        for (var u in self.users()) {
            if (self.users()[u]().selected()) {
                selected++;
            }
        }
        return selected;
    });
    self.maxSelected = 5;
    self.canSelect = ko.computed(function () {
        return self.maxSelected - self.selectedUsers();
    });
    self.setActiveUser = function (user) {
        var selected = self.selectedUsers();
        //for avoid situation when no users are selcted
        if ((selected == 1) && (user.selected() == true)) {
            return;
        }
        if ((self.selectedUsers() == self.maxSelected) && (!user.selected())) {
            return;
        }
        if (!user.selected()) {
            for (var i in colors) {
                if (!colors[i].used) {
                    user.color = colors[i].color;
                    colors[i].used = true;
                    break;
                }
            }
            if (!user.energyDataLoaded) {
                loadUserById(self, user.id);
            }
            user.selected(true);
        } else {
            for (var i in colors) {
                if (colors[i].color == user.color) {
                    colors[i].used = false;
                    break;
                }
            }
            user.selected(false);
        }
    }

    self.setActiveUser(self.users()[currentUserN]());
    self.selectedRange = ko.observable();
    self.graphDescriptor = ko.computed(function () {
        if (!self.users()[0]) {
            return 0;
        }
        var desc = {};
        desc.dataSets = [];
        desc.colors = [];
        //array of datasets to render on graph
        for (var i = 0; i < self.users().length; i++) {
            if (self.users()[i]().selected()) {
                desc.dataSets.push(self.users()[i]()[self.dataType()][self.scale().index]);
                desc.colors.push(self.users()[i]().color);
            }
        }
        //scale for graph
        desc.scale = self.scale().index;
        //if you want, you can set your own labels for horizontal axes like this
        //desc.horLables = ['first','second','third']
        //if you don't - label will be drawn according to scale
        desc.applySelectedRange = function (dateStart, dateEnd, rangeSelected) {
            if (dateStart == '') {
                self.selectedRange('');
                return;
            }
            self.selectedRange({ dateStart: dateStart, dateEnd: dateEnd, rangeSelected: rangeSelected });
        }

        //need this part for initialising table under the graph
        var minDate;
        var maxDate;
        if(desc.dataSets[0][0]===undefined){
            return desc;
        }
        minDate = new Date(desc.dataSets[0][0].date);
        maxDate = new Date(desc.dataSets[0][0].date);
        for (var set in desc.dataSets) {
            for (var val in desc.dataSets[set]) {
                if (desc.dataSets[set][val].date < minDate) {
                    minDate = new Date(desc.dataSets[set][val].date);
                }
                if (desc.dataSets[set][val].date > maxDate) {
                    maxDate = new Date(desc.dataSets[set][val].date);
                }
            }
        }
        maxDate.setHours(23);
        maxDate.setMinutes(59);
        maxDate.setSeconds(59);
        maxDate.setMilliseconds(999);
        self.selectedRange({ dateStart: minDate, dateEnd: maxDate, rangeSelected: false });

        return desc;
    });
    self.productionAmount = ko.computed(function () {
        if (!self.users()[currentUserN]) {
            return 0;
        }
        var sum = 0;
        var array = self.users()[currentUserN]().production[self.scale().index];
        for (var i = 0; i < array.length; i++) {
            sum += parseFloat(array[i].value);
        }
        sum = sum.toFixed(1);
        return sum;
    });
    self.CO2Amount = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61).toFixed(1);
        return res;
    });
    self.kmOnCar = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61 * 3.8624256).toFixed(1);
        return res;
    });
    self.hOfVac = ko.computed(function () {
        var res;
        res = (self.productionAmount() / 1.5).toFixed(1);
        return res;
    });
    self.trees = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61 * 0.026).toFixed(1);
        return res;
    });

    self.sortingBy = ko.observable('selfSufficiency');
    self.sortByProd = function () {
        self.sortingBy('production');
    }
    self.sortByCons = function () {
        self.sortingBy('consumption');
    }
    self.sortByRate = function () {
        self.sortingBy('selfSufficiency');
    }
    self.addInfo = ko.computed(function () {
        var res = {};
        res.rows = [];
        res.range = '';
        if (self.selectedRange() == '') {
            return;
        }

        function rangeSelected() {
            var dateStart = self.selectedRange().dateStart;
            var dateEnd = self.selectedRange().dateEnd;
            for (var user in self.users()) {
                var u = self.users()[user]();
                if (!u.selected()) {
                    continue;
                }
                var row = [];
                row.name = u.name;
                var cons = sumByDateRange(u.consumption[self.scale().index], dateStart, dateEnd);
                var prod = sumByDateRange(u.production[self.scale().index], dateStart, dateEnd);
                var sSuff = prod / cons * 100;
                sSuff>100?sSuff=100:sSuff;
                if (isNaN(sSuff)) {
                    sSuff = '';
                } else {
                    sSuff = sSuff.toFixed(2) * 1;
                }
                if (cons != null) {
                    cons = cons.toFixed(2) * 1;
                }
                if (prod != null) {
                    prod = prod.toFixed(2) * 1;
                }

                row.production = prod;
                row.consumption = cons;
                row.selfSufficiency = sSuff;

                row.bestProducer = false;
                row.lowestConsumer = false;
                row.bestRate = false;

                res.rows.push(row);
            }
        }
        rangeSelected();

        function findWinners() {
            if (res.rows.length < 2) {
                return;
            }
            var bestProducerN = 0;
            var lowestConsumerN = 0;
            var bestRateN = 0;
            var bestProd = res.rows[0].production;
            var lowestCons = res.rows[0].consumption;
            var bestRate = res.rows[0].selfSufficiency;
            for (var r in res.rows) {
                if (res.rows[r].production > bestProd) {
                    bestProd = res.rows[r].production;
                    bestProducerN = r;
                }
                if (res.rows[r].consumption < lowestCons&&res.rows[r].consumption!=0) {
                    lowestCons = res.rows[r].consumption;
                    lowestConsumerN = r;
                }
                if (res.rows[r].selfSufficiency > bestRate) {
                    bestRate = res.rows[r].selfSufficiency;
                    bestRateN = r;
                }
            }
            res.rows[bestProducerN].bestProducer = true;
            res.rows[lowestConsumerN].lowestConsumer = true;
            res.rows[bestRateN].bestRate = true;
        }
        findWinners();

        function setRangeName() {
            if (self.scale().index == 'monthInterval') {
                if (!self.selectedRange().rangeSelected) {
                    var dS = self.selectedRange().dateStart;
                    var dE = self.selectedRange().dateEnd;
                    res.range = monthsShort[dS.getMonth()] + ', ' + dS.getFullYear();
                    res.range += ' - ' + monthsShort[dE.getMonth()] + ', ' + dE.getFullYear();
                } else {
                    var d = self.selectedRange().dateEnd;
                    res.range = months[d.getMonth()] + ', ' + d.getFullYear();
                }
            }

            if (self.scale().index == 'dayInterval') {
                var dS = self.selectedRange().dateStart;
                var dE = self.selectedRange().dateEnd;
                if (self.selectedRange().rangeSelected) {
                    res.range = dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
                } else {
                    res.range = dS.getDate() + ' ' + months[dS.getMonth()] + ', ' + dS.getFullYear();
                    res.range += ' - ' + dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
                }
            }

            if (self.scale().index == 'weekInterval') {
                var dS = new Date(self.selectedRange().dateStart);
                dS.setDate(dS.getDate() + 1);
                var dE = self.selectedRange().dateEnd;
                res.range = dS.getDate() + ' ' + months[dS.getMonth()] + ', ' + dS.getFullYear();
                res.range += ' - ' + dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
            }
        }
        setRangeName();

        function sort() {
            var field = self.sortingBy();
            switch (field) {
                case 'consumption': {
                    for (var r1 in res.rows) {
                        for (var r2 in res.rows) {
                            if (res.rows[r1][field] < res.rows[r2][field]) {
                                var temp = res.rows[r1];
                                res.rows[r1] = res.rows[r2];
                                res.rows[r2] = temp;
                            }
                        }
                    }
                    break;
                }
                default: {
                    for (var r1 in res.rows) {
                        for (var r2 in res.rows) {
                            if (res.rows[r1][field] > res.rows[r2][field]) {
                                var temp = res.rows[r1];
                                res.rows[r1] = res.rows[r2];
                                res.rows[r2] = temp;
                            }
                        }
                    }
                    break;
                }
            }

        }
        sort();

        function allToFixed() {
            for (var r in res.rows) {
                res.rows[r].production = res.rows[r].production.toFixed(2);
                res.rows[r].consumption = res.rows[r].consumption.toFixed(2);
            }
        }
        allToFixed();

        return res;
    });

    self.enableHover = function (user) {
        user.mouseHover(true);
    }
    self.disableHover = function (user) {
        user.mouseHover(false);
    }
    self.getBackgroundColor = function (user) {
        var color;
        if (user.mouseHover()) {
            color = '#f7f7f7';
        }
        if (user.selected()) {
            color = user.color;
        }
        return color;
    }
    var t = 0;
}
getMinimalInfo();


