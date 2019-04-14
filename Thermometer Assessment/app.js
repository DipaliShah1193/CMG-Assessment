//Pass all logs readings as a string
tempCalculation("reference 70.0 45.0 thermometer temp-1 2007-04-05T22:00 72.4 2007-04-05T22:01 76.0 2007-04-05T22:02 79.1 2007-04-05T22:03 75.6 2007-04-05T22:04 71.2 2007-04-05T22:05 71.4 2007-04-05T22:06 69.2 2007-04-05T22:07 65.2 2007-04-05T22:08 62.8 2007-04-05T22:09 61.4 2007-04-05T22:10 64.0 2007-04-05T22:11 67.5 2007-04-05T22:12 69.4 thermometer temp-2 2007-04-05T22:01 69.5 2007-04-05T22:02 70.1 2007-04-05T22:03 71.3 2007-04-05T22:04 71.5 2007-04-05T22:05 69.8 humidity hum-1 2007-04-05T22:04 45.2 2007-04-05T22:05 45.3 2007-04-05T22:06 45.1 humidity hum-2 2007-04-05T22:04 44.4 2007-04-05T22:05 43.9 2007-04-05T22:06 44.9 2007-04-05T22:07 43.8 2007-04-05T22:08 42.1");

function tempCalculation(val) {
    var ref = ['reference', 'thermometer', 'humidity'];
    //output object
    var output = {
        "temp-1": "",
        "temp-2": "",
        "hum-1": "",
        "hum-2": ""
    };
    var refIndex = [];

    ref.forEach(function (element) {
        var tempVar = val.indexOf(element);
        refIndex.push(tempVar);
    });

    var referenceObj = {};
    referenceObj[ref[0]] = val.substring(refIndex[0], refIndex[1]);
    referenceObj[ref[1]] = val.substring(refIndex[1], refIndex[2]);
    referenceObj[ref[2]] = val.substring(refIndex[2]);

    var referenceArr = referenceObj['reference'].split(" ");
    var humRef = referenceArr[2];
    var thermometerRef = referenceObj['thermometer'].split('thermometer');
    var humidityRef = referenceObj['humidity'].split('humidity');

    //thermometer calculation
    output['temp-1'] = calTempAccuracy(deviation(filteredData(thermometerRef[1])));
    output['temp-2'] = calTempAccuracy(deviation(filteredData(thermometerRef[2])));

    //humidity calculation
    output['hum-1'] = humSenCalculation((filteredData(humidityRef[1])), humRef);
    output['hum-2'] = humSenCalculation((filteredData(humidityRef[2])), humRef);

    console.log("Output", output)
    return output;
}

function filteredData(val) {
    return val.split(" ").filter(data => {
        return data.length < 5 && data.length > 0
    });
}

//Calucalate deviation of list
function deviation(nArr) {
    var total = 0;
    nArr.forEach(function (data) {
        total = total + parseFloat(data);
    });
    var meanVal = total / nArr.length;
    var devCal = 0;
    for (var key in nArr) {
        devCal += Math.pow((parseFloat(nArr[key]) - meanVal), 2);
    }
    var result = Math.sqrt(devCal / nArr.length);
    return result;
}

//Calculate Temperature Accuracy
function calTempAccuracy(stdDev) {
    return ((stdDev < 3) ? 'ultra precise' :
        (3 < stdDev && stdDev < 5) ? 'very precise' :
            'precise');
}

//Calculate Humidty Sensor readings
function humSenCalculation(arr, humRef) {
    //1% of reference value
    var tempVal = (1 / 100) * humRef; //calculate 1% of reference value

    for (var i = 0; i < arr.length; i++) {
        if (((tempVal + parseInt(humRef)) - arr[i]) > 1) return 'discard'; //reading will discarded if does not match 1% of referece value
    }
    return 'keep';
}

