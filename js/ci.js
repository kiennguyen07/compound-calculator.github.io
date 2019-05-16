function getPeriodsPerYear(frequency) {
    var periods = !1;
    switch (frequency) {
    case "year":
        periods = 1;
        break;
    case "quarter":
        periods = 4;
        break;
    case "fortnight":
        periods = 26;
        break;
    case "month":
        periods = 12;
        break;
    case "week":
        periods = 52;
        break;
    case "day":
        periods = 365;
        break;
    default:
        periods = !1
    }
    return periods
}
function getNumberOfPeriods(frequency, multiplier) {
    var periods = getPeriodsPerYear(frequency);
    if(!periods){
        return periods;
    }
    return periods * multiplier;
}
function getPeriodInterestRate(frequency, rateVal) {
    var periods = getPeriodsPerYear(frequency);
    if(!periods){
        return periods;
    }
    return rateVal / periods;
}

function calcFV(initialDeposit, regularDeposit, interestRate, depositFrequency, compoundFrequency, tenure) {
    var result = {};
    result.initial = initialDeposit,
    result.FV = result.initial * Math.pow(1 + interestRate / compoundFrequency, compoundFrequency * tenure);
    var deposits = regularDeposit * depositFrequency / compoundFrequency;
    return result.FV += deposits * (Math.pow(1 + interestRate / compoundFrequency, compoundFrequency * tenure) - 1) / (interestRate / compoundFrequency), result.totalRegular = regularDeposit * depositFrequency * tenure, result.totalInterest = result.FV - result.totalRegular - result.initial, result
}

function drawChart() {

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'age');
    dataTable.addColumn('number', 'Balance');
    dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
    dataTable.addColumn('number', 'Total Deposit');
    dataTable.addColumn('number', 'Total Interest');

    for (let index = 0; index < fvResults.FVs.length; index++) {
        // var today = new Date();
        // tempRow.push(today.getFullYear() + index);

        dataTable.addRows([
            [parseInt(fvResults.age) + index + 1, fvResults.FVs[index], createCustomHTMLContent(fvResults.FVs[index], parseInt(fvResults.age) + index + 1, fvResults.regulars[index], fvResults.initials[index], fvResults.totalInterests[index]), fvResults.regulars[index], fvResults.totalInterests[index]]
        ]);
    } 

    var colorsAttributes = $('.customLogoChart');

    var options = {
        focusTarget: 'category',
        legend: {position: 'none'},
        vAxis: {title: 'Balance', format: 'currency'},
        hAxis: {title: 'Age', format: '00', gridlines: { count: fvResults.FVs.length}},
        seriesType: 'bars',
        series: {5: {type: 'line'}},
        isStacked: true,
        tooltip: { isHtml: true },
        chartArea: {'height': '80%', 'align': 'center', 'width': '90%'},
        colors: [colorsAttributes.attr('balance-color'), colorsAttributes.attr('deposits-color'), colorsAttributes.attr('interest-color')],
        height: window.innerWidth > 1024 ? window.innerWidth/3 : window.innerWidth/2
    };

    // Create and draw the visualization.
    new google.visualization.ColumnChart(document.getElementById('chart_div')).draw(dataTable, options);
}

function createCustomHTMLContent(balance, yourAge, contibution, initialDeposit, totalInterest) {
    var returnStr = '<table class="table summaryTable table-responsive"><tbody>';
    returnStr += '<tr><td class="primary_header">Age</td>';
    returnStr += '<td class="rightBorder">' + yourAge + '</td></tr>';
    returnStr += '<tr><td class="primary_header">Total Contribution</td>';
    returnStr += '<td class="rightBorder">$'+ (initialDeposit + contibution).toLocaleString() +'</td></tr>';
    returnStr += '<tr><td class="primary_header">Total Interest</td>';
    returnStr += '<td class="rightBorder">$'+ totalInterest.toLocaleString() +'</td></tr>';
    returnStr += '<tr class="balance"><td class="primary_header">Total Balance</td>';
    returnStr += '<td class="rightBorder">$'+ balance.toLocaleString() +'</td></tr>';
    returnStr += '</tbody></table>';
    return returnStr;
}

function onChangeValues() {
    $('#resultsTableBody').empty();
    var initialDeposit = $.trim($('#calc_initialInvest').val()) == '' ? 0 : parseFloat($('#calc_initialInvest').val())
    , interestRate = parseFloat($('#calc_interest').val())
    , regularDeposit = parseFloat($('#calc_monthlyInvest').val())
    , noOfYears = parseInt($('#calc_investDuration').val())
    , depositFrequency = $('#ddDepositFrequency').val()
    , compoundFrequency = $('#ddCompoundFrequency').val()
    , currentAge = $('#calc_age').val()
    , altCompoundFrequency = ""
    , altDeposit = parseFloat("")
    , altDelay = parseInt("");

    if (!isNaN(initialDeposit) && !isNaN(interestRate) && !isNaN(regularDeposit) && !isNaN(noOfYears) && depositFrequency && compoundFrequency) {
        fvResults.initials = Array(),
        fvResults.regulars = Array(),
        fvResults.totalInterests = Array(),
        fvResults.FVs = Array(),
        fvResults.years = Array(),
        fvResults.age = currentAge;
        var years = 1;
        for (years = 1; noOfYears >= years; years++) {
            var fvCalc = calcFV(initialDeposit, regularDeposit, interestRate / 100, getPeriodsPerYear(depositFrequency), getPeriodsPerYear(compoundFrequency), years);
            fvResults.initials.push(fvCalc.initial);
            fvResults.regulars.push(fvCalc.totalRegular);
            fvResults.totalInterests.push(Math.round(fvCalc.totalInterest));
            fvResults.FVs.push(Math.round(fvCalc.FV));
            fvResults.years.push(years);

            var today = new Date();
            today.getFullYear();

            var tr = $('<tr>');
            var td1 = $('<td class="text-center">' + (today.getFullYear() + years) + '</td>');
            var td2 = $('<td class="text-center">' + (parseInt(currentAge) + years) + '</td>');
            var td3 = $('<td class="text-center">$' + parseFloat(fvCalc.initial + fvCalc.totalRegular).toLocaleString('en') + '</td>');
            var td4 = $('<td class="text-center">$' + parseFloat(Math.round(fvCalc.totalInterest)).toLocaleString('en') + '</td>');
            var td5 = $('<td class="text-center">$' + parseFloat(Math.round(fvCalc.FV)).toLocaleString('en') + '</td>');

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            tr.append(td5);
            
            if (!pageVar.viewMore && years <= 5) {
                $('#resultsTableBody').append(tr);
            }else if(pageVar.viewMore){
                $('#resultsTableBody').append(tr);
            }
        }
        if (!isNaN(altDeposit) && !isNaN(altDelay) && altCompoundFrequency) {
            for (fvResultsAlt.initials = Array(),
            fvResultsAlt.regulars = Array(),
            fvResultsAlt.totalInterests = Array(),
            fvResultsAlt.FVs = Array(),
            fvResultsAlt.years = Array(),
            years = 1; noOfYears >= years; years++)
                if (noOfYears > altDelay) {
                    var fvCalc = calcFV(initialDeposit, altDeposit, interestRate / 100, wpfinGetPeriodsPerYear(depositFrequency), wpfinGetPeriodsPerYear(altCompoundFrequency), years - altDelay);
                    fvResultsAlt.initials.push(fvCalc.initial),
                    fvResultsAlt.regulars.push(fvCalc.totalRegular),
                    fvResultsAlt.totalInterests.push(Math.round(fvCalc.totalInterest)),
                    fvResultsAlt.FVs.push(Math.round(fvCalc.FV)),
                    fvResultsAlt.years.push(years)
                } else
                    fvResultsAlt.initials.push(0),
                    fvResultsAlt.regulars.push(0),
                    fvResultsAlt.totalInterests.push(0),
                    fvResultsAlt.FVs.push(0),
                    fvResultsAlt.years.push(years);
            // console.log("$" + fvResultsAlt.initials[fvResultsAlt.initials.length - 1].toLocaleString()),
            // console.log("$" + fvResultsAlt.regulars[fvResultsAlt.regulars.length - 1].toLocaleString()),
            // console.log("$" + fvResultsAlt.totalInterests[fvResultsAlt.totalInterests.length - 1].toLocaleString()),
            // console.log("$" + fvResultsAlt.FVs[fvResultsAlt.FVs.length - 1].toLocaleString())
        }
        //drawChart(),
        // console.log("$" + fvResults.initials[fvResults.initials.length - 1].toLocaleString()),
        // console.log("$" + fvResults.regulars[fvResults.regulars.length - 1].toLocaleString()),
        // console.log("$" + fvResults.totalInterests[fvResults.totalInterests.length - 1].toLocaleString()),
        // console.log("$" + fvResults.FVs[fvResults.FVs.length - 1].toLocaleString());

        $('#initialDeposits').html("$" + fvResults.initials[fvResults.initials.length - 1].toLocaleString()),
        $('#regularDeposits').html("$" + fvResults.regulars[fvResults.regulars.length - 1].toLocaleString()),
        $('#totalInterests').html("$" + fvResults.totalInterests[fvResults.totalInterests.length - 1].toLocaleString()),
        $('#totalSavings').html("$" + fvResults.FVs[fvResults.FVs.length - 1].toLocaleString());

        $('#csAge').html(parseInt(currentAge) + noOfYears),
        $('#csTotalInvestment').html("$" + fvResults.FVs[fvResults.FVs.length - 1].toLocaleString()),
        $('#csContribution').html("$" + (fvResults.initials[fvResults.initials.length - 1] + fvResults.regulars[fvResults.regulars.length - 1]).toLocaleString()),
        $('#csyears').html(years - 1);


        if (typeof google == 'object' && google.visualization != undefined) {
            drawChart();
        }
    }
}

function createTable() {
    for (let index = 0; index < fvResults.FVs.length; index++) {
        const element = fvResults.FVs[index];
        
    }


}

var strategy = {}
  , alternative = {}
  , fvResults = {}
  , fvResultsAlt = {};
