/**
 * Created by Sandeep on 10/17/16.
 */


// Initialize Variable here.
const KEY="5e63ecf1481c019e28003690bccb25f9f97f5e64";
const defaultYEAR="2015";
const defaultRegionType="state";

var year="2015";
var regionType="state";     // can be set to "state" or "county' . remember this is case sensitive.
var regionName="*";   // represent all unless specified.
const baseURL="http://api.census.gov/data/";
var  tableCode="";
var xmlDoc;
var controlChoice1, controlChoice2, controlChoice3,controlChoice4 ;
var deferredTask=new $.Deferred();
var xmlLoaded=deferredTask.promise();



// on front end assign value of variable to each of the  control and then extract that to create final value of the varialble.

function generateTableCode(controlChoice1,controlChoice2,controlChoice3,controlChoice4)
{

    tableCode="";  //reset the table code
    var path="";
    if(controlChoice2.length>1 && controlChoice3.length>1 && controlChoice4.length>1){
        path=controlChoice1+">"+controlChoice2+">"+controlChoice3+">"+controlChoice4;
    } else if(controlChoice2.length>1 && controlChoice3.length>1 && controlChoice4.length<1){
        path=controlChoice1+">"+controlChoice2+">"+controlChoice3;
    } else if (controlChoice2.length>1 && controlChoice3.length<1 && controlChoice4.length<1){
        path=controlChoice1+">"+controlChoice2;
    } else {
        path=controlChoice1;
    }

        tableCode=$(xmlDoc).find(path).text().trim();

}



function requestJSON(url,callback)
{


    d3.json(url, function(error, json) {
        if (error) {
            return console.warn(error);}
        else
        {
            // when task is successful this call back return values of to await all.
            // first argument inform error status and second one gives back results.
            callback(null,json);
        }

    });

}



function fetchDataWitURL(tableCode,regionID,regionType)
{

    var deferredTask=new $.Deferred();
    var dataLoded=deferredTask.promise();

    // sample url for county: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=county:*&key=.
    // sample url for state: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=state:*&key=.
    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+regionID+""+"&key="+KEY;
    console.log(url);

    var dataFetchingQueue = d3.queue();
    var temp;
    var variableColumn = 0;
    var variableValue;

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);
        //if there is any pre-processing required we can call that function and user regualr defer there to control flow before drawing map.
        temp=results;

        variableValue= parseFloat(results[0][1][variableColumn]);


        if (isNaN(variableValue))
            variableValue=null;
            deferredTask.resolve();



    });


}




function fetchData(controlChoice1,controlChoice2,controlChoice3,controlChoice4)
{

    //This function generate table code.
    generateTableCode(controlChoice1,controlChoice2,controlChoice3,controlChoice4);
    // sample url for county: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=county:*&key=.
    // sample url for state: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=state:*&key=.
    var url=baseURL+year+"/acs1?get="+"NAME,"+tableCode+"&for="+regionType+":"+regionName+""+"&key="+KEY;
    console.log(url);

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        //console.log(results.);
        //if there is any pre-processing required we can call that function and user regualr defer there to control flow before drawing map.

        var name = 0;
        var variableColumn=1;
        var stateID=2;
        var countyID=3;
        var myArrayOfObjects = [];

        for (var rowNumber = 1; rowNumber < results[0].length; rowNumber++) {
            // make an object to store myArrayOfObjects
            var keyValPair = {
                variableValue: parseFloat(results[0][rowNumber][variableColumn]),
                stateName: results[0][rowNumber][name],
                countyName: results[0][rowNumber][name],
                stateID: results[0][rowNumber][stateID],
                countyID: results[0][rowNumber][countyID],
            }

            if (!isNaN(keyValPair.variableValue))
                myArrayOfObjects.push(keyValPair);
        }

        // Start drawing map now
        drawMap(myArrayOfObjects);
    });
}


function fetchData2(controlChoice1,controlChoice2,controlChoice3,controlChoice4)
{

    //This function generate table code.
    generateTableCode(controlChoice1,controlChoice2,controlChoice3,controlChoice4);
    // sample url for county: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=county:*&key=.
    // sample url for state: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=state:*&key=.
    var url=baseURL+year+"/acs1?get="+"NAME,"+tableCode+"&for="+regionType+":"+regionName+""+"&key="+KEY;
    console.log(url);

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        //console.log(results.);
        //if there is any pre-processing required we can call that function and user regualr defer there to control flow before drawing map.

        var name = 0;
        var variableColumn=1;
        var stateID=2;
        var countyID=3;
        var myArrayOfObjects = [];

        for (var rowNumber = 1; rowNumber < results[0].length; rowNumber++) {
            // make an object to store myArrayOfObjects
            var keyValPair = {
                variableValue: parseFloat(results[0][rowNumber][variableColumn]),
                stateName: results[0][rowNumber][name],
                countyName: results[0][rowNumber][name],
                stateID: results[0][rowNumber][stateID],
                countyID: results[0][rowNumber][countyID],
            }

            if (!isNaN(keyValPair.variableValue))
                myArrayOfObjects.push(keyValPair);
        }

        // Start drawing map now
        drawMiniMap(myArrayOfObjects);
    });
}



function drawAllMaps(id)
{

    var options1=d3.select(".optState");
    var options2=d3.select(".optCounty");

    if(regionType=="state") {

        $("#state").prop('checked',true);
        options1.style({'display':'block'});
        options2.style({'display':'none'});
    }
    else {

        $("#county").prop('checked',true);
        radio.prop('checked',true);
        options1.style({'display':'none'});
        options2.style({'display':'block'});
    }

    var selection1 = document.getElementById('selectionWidget1');
    var cursor1 =""
    if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

    var selection2 = document.getElementById('selectionWidget2');
    var cursor2="";
    if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

    var selection3 = document.getElementById('selectionWidget3');
    var cursor3 ="";
    if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

    var selection4 = document.getElementById('selectionWidget4');
    var cursor4 = "";
    if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;

    // set region type radio based on region type
    // show countie or state and set selected options to sate or county selection based on the regionType

    drawPopulationDistibutionPieChart(id)

    fetchData2(cursor1,cursor2,cursor3,cursor4);
    drawAgeDistibutionPieChart(id);
    drawRacePieChart(id);
    drawLivingArrangementsForAdultsPieChart(id);
    drawPlaceOfBirthNativityPieChart(id);
    drawIncomeToPovertyLevelRatioPieChart(id);
    drawPovertyLevelByPlaceOfBirthPieChart(id);
    drawEducationalAttainmentByPlaceOfBirthPieChart(id);
    drawMeansOfTransportationToWorkPieChart(id);
    writeMedianHouseholdIncome(id);
    writePerCapitaIncome(id);

}

function writeMedianHouseholdIncome(id) {

    tableCode = "B19013_001E";
    var url = baseURL + year + "/acs1?get=" + tableCode + "&for=" + regionType + ":" + id + "" + "&key=" + KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON, url);
    dataFetchingQueue.awaitAll(function (error, results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        totalMHI = parseFloat(results[0][1][0]);

        //d3.select('#text').append("text").attr("type","text").style("height","27px").text(totalMHI);
        d3.select('#text1').text(function(d) { return d3.format("($,.2r")(totalMHI); });

    });
}

function writePerCapitaIncome(id) {

    tableCode = "B19301_001E";
    var url = baseURL + year + "/acs1?get=" + tableCode + "&for=" + regionType + ":" + id + "" + "&key=" + KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON, url);
    dataFetchingQueue.awaitAll(function (error, results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        totalPCI = parseFloat(results[0][1][0]);

        //d3.select('#text').append("text").attr("type","text").style("height","27px").text(totalMHI);
        d3.select('#text2').text(function(d) { return d3.format("($,.2r")(totalPCI); });

    });
}

function drawPopulationDistibutionPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B01001_002E,B01001_026E,B01001_001E"

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    console.log(url);
    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        malePopulation= parseFloat(results[0][1][0]);
        femalePopulation= parseFloat(results[0][1][1]);
        totalPopulation= parseFloat(results[0][1][2]);

        var pieObjects = [
            {
                key: "Male",
                value: malePopulation,
                percent:malePopulation/totalPopulation

            },
            {
                key: "Female",
                value: femalePopulation,
                percent:femalePopulation/totalPopulation

            }]
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det2")
            .attr("width", outerWidth)
            .attr("height", outerHeight)

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawAgeDistibutionPieChart(id) {

    

    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B01001_001E,B01001_002E,B01001_003E,B01001_004E,B01001_005E,B01001_006E,B01001_007E,B01001_008E,B01001_009E,B01001_010E,B01001_011E,B01001_012E,B01001_013E,B01001_013E,B01001_014E,B01001_015E,B01001_016E,B01001_017E,B01001_018E,B01001_019E,B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_026E,B01001_027E,B01001_028E,B01001_029E,B01001_031E,B01001_032E,B01001_033E,B01001_034E,B01001_035E,B01001_036E,B01001_037E,B01001_038E,B01001_039E,B01001_040E,B01001_041E,B01001_042E,B01001_043E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

console.log(url);
    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
                console.log("Error Occurred while fetching data!");
                throw error;
            }
        console.log("Gotcha !!");
        console.log(results);

        //malePopulation= parseFloat(results[0][1][1]);
        //femalePopulation= parseFloat(results[0][1][]);
        totalPopulation= parseFloat(results[0][1][0]);


        Under5= parseFloat(results[0][1][2]);
        _5to14= parseFloat(results[0][1][3]) + parseFloat(results[0][1][4]);
        _15to19= parseFloat(results[0][1][5]) + parseFloat(results[0][1][6]);
        _20to29= parseFloat(results[0][1][7]) + parseFloat(results[0][1][8]) + parseFloat(results[0][1][9]) + parseFloat(results[0][1][10]);
        _30to49= parseFloat(results[0][1][11]) + parseFloat(results[0][1][12]) + parseFloat(results[0][1][13]) + parseFloat(results[0][1][14]);
        _50to69= parseFloat(results[0][1][15]) + parseFloat(results[0][1][16]) + parseFloat(results[0][1][17]) + parseFloat(results[0][1][18]);
        _70to84= parseFloat(results[0][1][18]) + parseFloat(results[0][1][20]) + parseFloat(results[0][1][21]) + parseFloat(results[0][1][22]);
        _84AndAbove= parseFloat(results[0][1][23]) + parseFloat(results[0][1][24]) + parseFloat(results[0][1][25]);

        var pieObjects = [
            {
                key: "Under5",
                value: Under5,
                percent:Under5/ totalPopulation

            },
            {
                key: "5 to 14",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "15 to 19",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "20 to 29",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "30 to 49",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "50 to 69",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "70 to 84",
                value: _5to14,
                percent: _5to14/ totalPopulation

            },
            {
                key: "84 and Above",
                value: _5to14,
                percent: _5to14/ totalPopulation

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
                    .outerRadius(radius * 0.8)
                    .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                         return d.value;
                     });


        // select SVG element on the DOM
        var svg = d3.select("#det3")
            .attr("width", outerWidth)
            .attr("height", outerHeight)

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


        });


}


function drawRacePieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B02001_001E,B02001_002E,B02001_003E,B02001_004E,B02001_005E,B02001_006E,B02001_007E,B02001_008E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalRace= parseFloat(results[0][1][0]);
        whiteAlone= parseFloat(results[0][1][1]);
        blackOrAfricanAmericanAlone= parseFloat(results[0][1][2]);
        americanIndianAndAlaskaNativeAlone= parseFloat(results[0][1][3]);
        asianAlone= parseFloat(results[0][1][4]);
        nativeHawaiianAndOtherPacificIslanderAlone= parseFloat(results[0][1][5]);
        someOtherRaceAlone= parseFloat(results[0][1][6]);
        twoOrMoreRaces= parseFloat(results[0][1][7]);

        var pieObjects = [
            {
                key: "White Alone",
                value: whiteAlone,
                percent:whiteAlone/totalRace

            },
            {
                key: "Black or African American Alone",
                value: blackOrAfricanAmericanAlone,
                percent: blackOrAfricanAmericanAlone / totalRace

            },
            {
                key: "American Indian and Alaska Native Alone",
                value: americanIndianAndAlaskaNativeAlone,
                percent:americanIndianAndAlaskaNativeAlone/totalRace

            },
            {
                key: "Asian Alone",
                value: asianAlone,
                percent:asianAlone/totalRace

            },
            {
                key: "Native Hawaiian and Other Pacific Islander Alone",
                value: nativeHawaiianAndOtherPacificIslanderAlone,
                percent:nativeHawaiianAndOtherPacificIslanderAlone/totalRace

            },
            {
                key: "Some Other Race Alone",
                value: someOtherRaceAlone,
                percent: someOtherRaceAlone/totalRace

            },
            {
                key: "Two or More Races",
                value: twoOrMoreRaces,
                percent:twoOrMoreRaces/totalRace

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det5")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawLivingArrangementsForAdultsPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B09021_001E,B09021_002E,B09021_003E,B09021_004E,B09021_005E,B09021_006E,B09021_007E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalLivingArrangements= parseFloat(results[0][1][0]);
        livesAlone= parseFloat(results[0][1][1]);
        householderLivingWithSpouseOrSpouseOfHouseholder= parseFloat(results[0][1][2]);
        householderLivingWithUnmarriedPartnerOrUnmarriedPartnerOfHouseholder= parseFloat(results[0][1][3]);
        childOfHouseholder= parseFloat(results[0][1][4]);
        otherRelatives= parseFloat(results[0][1][5]);
        someOtherRaceAlone= parseFloat(results[0][1][6]);
        otherNonrelatives= parseFloat(results[0][1][7]);

        var pieObjects = [
            {
                key: "Lives Alone",
                value: livesAlone,
                percent:livesAlone/totalLivingArrangements

            },
            {
                key: "Householder Living With Spouse or Spouse of Householder",
                value: householderLivingWithSpouseOrSpouseOfHouseholder,
                percent: householderLivingWithSpouseOrSpouseOfHouseholder / totalLivingArrangements

            },
            {
                key: "Householder Living with Unmarried Partner or Unmarried Partner of Householder",
                value: householderLivingWithUnmarriedPartnerOrUnmarriedPartnerOfHouseholder,
                percent:householderLivingWithUnmarriedPartnerOrUnmarriedPartnerOfHouseholder/totalLivingArrangements

            },
            {
                key: "Child of Householder",
                value: childOfHouseholder,
                percent:childOfHouseholder/totalLivingArrangements

            },
            {
                key: "Other Relatives",
                value: otherRelatives,
                percent:otherRelatives/totalLivingArrangements

            },
            {
                key: "Some Other Race Alone",
                value: someOtherRaceAlone,
                percent: someOtherRaceAlone/totalLivingArrangements

            },
            {
                key: "Other Non-relatives",
                value: otherNonrelatives,
                percent:otherNonrelatives/totalLivingArrangements

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det6")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawPlaceOfBirthNativityPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="C05002_001E,C05002_002E,C05002_008E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalPlaceOfBirth= parseFloat(results[0][1][0]);
        native= parseFloat(results[0][1][1]);
        foreignBorn= parseFloat(results[0][1][2]);

        var pieObjects = [
            {
                key: "Native",
                value: native,
                percent:native/ totalPlaceOfBirth

            },
            {
                key: "Foreign Born",
                value: foreignBorn,
                percent: foreignBorn / totalPlaceOfBirth

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det9")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawIncomeToPovertyLevelRatioPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B17002_001E,B17002_002E,B17002_003E,B17002_004E,B17002_005E,B17002_006E,B17002_007E,B17002_008E,B17002_009E,B17002_010E,B17002_011E,B17002_012E,B17002_013E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalIncomeToPovertyLevel= parseFloat(results[0][1][0]);
        Under50= parseFloat(results[0][1][1]);
        _50to74= parseFloat(results[0][1][2]);
        _75to99= parseFloat(results[0][1][3]);
        _1to124= parseFloat(results[0][1][4]);
        _125to149= parseFloat(results[0][1][5]);
        _150to174= parseFloat(results[0][1][6]);
        _175to184= parseFloat(results[0][1][7]);
        _188to199= parseFloat(results[0][1][8]);
        _200to299= parseFloat(results[0][1][9]);
        _300to399= parseFloat(results[0][1][10]);
        _400to499= parseFloat(results[0][1][11]);
        _5andOver= parseFloat(results[0][1][12]);

        var pieObjects = [
            {
                key: "Under .50",
                value: Under50,
                percent:Under50/ totalIncomeToPovertyLevel

            },
            {
                key: ".50 to .74",
                value: _50to74,
                percent: _50to74 / totalIncomeToPovertyLevel

            },
            {
                key: ".75 to .99",
                value:_75to99,
                percent:_75to99/ totalIncomeToPovertyLevel

            },
            {
                key: "1.00 to 1.24",
                value: _1to124,
                percent: _1to124 / totalIncomeToPovertyLevel

            },
            {
                key: " 1.25 to 1.49",
                value: _125to149,
                percent:_125to149/ totalIncomeToPovertyLevel

            },
            {
                key: "1.50 to 1.74",
                value: _150to174,
                percent: _150to174 / totalIncomeToPovertyLevel

            },
            {
                key: "1.75 to 1.84",
                value:_175to184,
                percent:_175to184/ totalIncomeToPovertyLevel

            },
            {
                key: "1.85 to 1.99",
                value: _188to199,
                percent: _188to199 / totalIncomeToPovertyLevel

            },
            {
                key: "2.00 to 2.99",
                value: _200to299,
                percent:_200to299/ totalIncomeToPovertyLevel

            },
            {
                key: " 3.00 to 3.99",
                value: _300to399,
                percent: _300to399 / totalIncomeToPovertyLevel

            },
            {
                key: "4.00 to 4.99",
                value:_400to499,
                percent:_400to499/ totalIncomeToPovertyLevel

            },
            {
                key: "5.00 and over",
                value: _5andOver,
                percent: _5andOver / totalIncomeToPovertyLevel
            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det10")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawPovertyLevelByPlaceOfBirthPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B06012_001E,B06012_005E,B06012_009E,B06012_013E,B06012_017E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalPovertyLevel= parseFloat(results[0][1][0]);
        bornInStateOfResidence= parseFloat(results[0][1][1]);
        bornInOtherStateInTheUnitedStates= parseFloat(results[0][1][2]);
        nativeBornOutsideTheUnitedState= parseFloat(results[0][1][3]);
        foreignBornPoverty= parseFloat(results[0][1][4]);

        var pieObjects = [
            {
                key: "Born in State of Residence",
                value: bornInStateOfResidence,
                percent:bornInStateOfResidence/ totalPovertyLevel

            },
            {
                key: "Born in Other State in the United States",
                value: bornInOtherStateInTheUnitedStates,
                percent: bornInOtherStateInTheUnitedStates / totalPovertyLevel

            },
            {
                key: "Native Born Outside the United State",
                value:nativeBornOutsideTheUnitedState,
                percent:nativeBornOutsideTheUnitedState/ totalPovertyLevel

            },
            {
            key: "Foreign Born",
            value: foreignBornPoverty,
            percent: foreignBornPoverty / totalPovertyLevel

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det11")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawEducationalAttainmentByPlaceOfBirthPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B06009_001E,B06009_007E,B06009_013E,B06009_019E,B06009_025E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;

    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalEducationalAttainment= parseFloat(results[0][1][0]);
        bornInStateOfResidenceEducationalAttainment= parseFloat(results[0][1][1]);
        bornInOtherStateInTheUnitedStatesEducationalAttainment= parseFloat(results[0][1][2]);
        nativeBornOutsideTheUnitedStateEducationalAttainment= parseFloat(results[0][1][3]);
        foreignBornEducationalAttainment= parseFloat(results[0][1][4]);

        var pieObjects = [
            {
                key: "Born in State of Residence",
                value: bornInStateOfResidenceEducationalAttainment,
                percent:bornInStateOfResidenceEducationalAttainment/ totalEducationalAttainment

            },
            {
                key: "Born in Other State in the United States",
                value: bornInOtherStateInTheUnitedStatesEducationalAttainment,
                percent: bornInOtherStateInTheUnitedStatesEducationalAttainment / totalEducationalAttainment

            },
            {
                key: "Native Born Outside the United State",
                value:nativeBornOutsideTheUnitedStateEducationalAttainment,
                percent:nativeBornOutsideTheUnitedStateEducationalAttainment/ totalEducationalAttainment

            },
            {
                key: "Foreign Born",
                value: foreignBornEducationalAttainment,
                percent: foreignBornEducationalAttainment / totalEducationalAttainment

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det13")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawMeansOfTransportationToWorkPieChart(id) {



    var pieObjects=[];

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B08301_001E,B08301_002E,B08301_010E,B08301_016E,B08301_017E,B08301_018E,B08301_019E,B08301_020E,B08301_021E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;
    console.log(url);
    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalMeanOfTransportationToWork= parseFloat(results[0][1][0]);
        carTruckOrVan= parseFloat(results[0][1][1]);
        publicTransportationExcludingTaxicab= parseFloat(results[0][1][2]);
        taxicab= parseFloat(results[0][1][3]);
        motorcycle= parseFloat(results[0][1][4]);
        bicycle= parseFloat(results[0][1][5]);
        walked= parseFloat(results[0][1][6]);
        otherMeans= parseFloat(results[0][1][7]);
        workedAtHome= parseFloat(results[0][1][8]);

        var pieObjects = [
            {
                key: "Car, Truck or Van",
                value: carTruckOrVan,
                percent:carTruckOrVan/ totalMeanOfTransportationToWork

            },
            {
                key: "Public Transportation Excluding Taxicab",
                value: publicTransportationExcludingTaxicab,
                percent: publicTransportationExcludingTaxicab / totalMeanOfTransportationToWork

            },
            {
                key: "Taxicab",
                value:taxicab,
                percent:taxicab/ totalMeanOfTransportationToWork

            },
            {
                key: "Motorcycle",
                value: motorcycle,
                percent: motorcycle / totalMeanOfTransportationToWork

            },
            {
                key: "Bicycle",
                value: bicycle,
                percent:bicycle/ totalMeanOfTransportationToWork

            },
            {
                key: "Walked",
                value: walked,
                percent: walked / totalMeanOfTransportationToWork

            },
            {
                key: "Other Means",
                value:otherMeans,
                percent:otherMeans/ totalMeanOfTransportationToWork

            },
            {
                key: "Worked at Home",
                value: workedAtHome,
                percent:workedAtHome / totalMeanOfTransportationToWork

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det14")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

function drawBarChart(id) {



    var pieObjects=[]

    var page1=d3.select("#page1");
    page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var options1=d3.select(".options1");
    options1.style({'display':'none'});

    var options2=d3.select(".options2");
    options2.style({'display':'block'});

    tableCode="B08303_001E,B08303_002E,B08303_003E,B08303_004E,B08303_005E,B08303_006E,B08303_007E,B08303_008E,B08303_009E,B08303_010E,B08303_011E,B08303_0012E,B08303_013E";

    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+id+""+"&key="+KEY;
    console.log(url);
    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);

        totalMeanOfTransportationToWork= parseFloat(results[0][1][0]);
        carTruckOrVan= parseFloat(results[0][1][1]);
        publicTransportationExcludingTaxicab= parseFloat(results[0][1][2]);
        taxicab= parseFloat(results[0][1][3]);
        motorcycle= parseFloat(results[0][1][4]);
        bicycle= parseFloat(results[0][1][5]);
        walked= parseFloat(results[0][1][6]);
        otherMeans= parseFloat(results[0][1][7]);
        workedAtHome= parseFloat(results[0][1][8]);

        var pieObjects = [
            {
                key: "Car, Truck or Van",
                value: carTruckOrVan,
                percent:carTruckOrVan/ totalMeanOfTransportationToWork

            },
            {
                key: "Public Transportation Excluding Taxicab",
                value: publicTransportationExcludingTaxicab,
                percent: publicTransportationExcludingTaxicab / totalMeanOfTransportationToWork

            },
            {
                key: "Taxicab",
                value:taxicab,
                percent:taxicab/ totalMeanOfTransportationToWork

            },
            {
                key: "Motorcycle",
                value: motorcycle,
                percent: motorcycle / totalMeanOfTransportationToWork

            },
            {
                key: "Bicycle",
                value: bicycle,
                percent:bicycle/ totalMeanOfTransportationToWork

            },
            {
                key: "Walked",
                value: walked,
                percent: walked / totalMeanOfTransportationToWork

            },
            {
                key: "Other Means",
                value:otherMeans,
                percent:otherMeans/ totalMeanOfTransportationToWork

            },
            {
                key: "Worked at Home",
                value: workedAtHome,
                percent:workedAtHome / totalMeanOfTransportationToWork

            }];
        for(i=0;i<pieObjects.length;i++){
            if (isNaN(pieObjects.value))
                pieObjects.value=0;

        }


        var outerWidth = 300;
        var outerHeight = 300;
        var margin = { left: 10, top: 10, right: 10, bottom: 10 };
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerHeight, innerWidth) /2;

        var colorScale = d3.scale.ordinal()
            .range(["#41b6c4","#1d91c0","#225ea8","#253494","#f0f9e8", "#bae4bc","#7bccc4","#edf8b1","#c7e9b4","#7fcdbb"]);

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });


        // select SVG element on the DOM
        var svg = d3.select("#det13")
            .attr("width", outerWidth)
            .attr("height", outerHeight);

        svg.selectAll("g").remove();

        // add group
        var group=svg.append("g").attr("transform", "translate("+outerWidth/2+","+ outerHeight/2+")");;

        var slice =group.selectAll(".arc")
            .data(pie(pieObjects))
            .enter().append("g")
            .attr("class", "arc");

        slice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return colorScale(d.data.key);
            });


        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".1em")
            .attr("class","pieValues")
            .text(function(d) { return d3.format(".0%")(d.data.percent); });

        slice.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", "1em")// you can vary how far apart it shows up
            .attr("class","pieValues")
            .text(function(d) { return d.data.key; });


    });


}

// function for drawing selected region
function drawState(selectedState,counties){


    var stateID= selectedState.id;
    var variableValue=selectedState.properties.variableValue;
    var stateName=selectedState.properties.stateName;


    var projection=d3.geo.albersUsa().scale(1000).translate([innerWidth/2,innerHeight/2]);
    var path=d3.geo.path().projection(projection);

    var svg = d3.select("#main2").attr("width",innerWidth).attr("height",innerHeight);
    svg.selectAll("g").remove();

    // hid main SVG and Show new SVG
    var page1=d3.select("#page1");
        page1.style({'display':'none'});

    var page2=d3.select("#page2");
    page2.style({'display':'block'});

    var countiesOfSelectedState= [];
    // add county data to selected state , redraw state
    for (var i = 0; i < counties.length; i++) {

        var county=counties[i].id.toString();

        if(parseInt(county.substring(0,county.length-3))==parseInt(stateID)){
            countiesOfSelectedState.push(counties[i]);
            console.log("match found");
        }
    }


    var group = svg.append("g");

    group.selectAll("path")
        .data(countiesOfSelectedState)
        .enter().append("path")
        .attr("d", path)
        .attr("class","state");


    /*   group.append("path")
     .data(countiesOfSelectedState)
     .attr("d", path)
     .attr("class","county")
     /*.attr("fill", function(d) {
     var value=d.properties.variableValue;
     if(value === undefined || value === null) return "#bbb";
     return colorScale(parseInt(value));
     }); */


}


function drawMap(myArrayOfObjects) {



    // This function takes data as input and draws map.
    console.log("Painting map");

    // chart size
    var outerWidth = 760;
    var outerHeight = 600;
    var margin = { left: 10, top: 10, right: 10, bottom: 10 };
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    var SVG = d3.select("#main").attr("width",innerWidth).attr("height",innerHeight);  // select SVG element on the DOM
        SVG.selectAll("g").remove();// remove previous  charts
    var group=SVG.append("g");// add group

    var variableArray = myArrayOfObjects.map(function(obj){
        return obj.variableValue;
    });

    // define colorscale function
    var colorScale = d3.scale.quantize()
                        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)","rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"]);
                        //.range(["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a","#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);
                    //.range(d3.range(9).map(function(number) { return "level"+number}));

    colorScale.domain(d3.extent(variableArray));

    // projection defines how map is laidout on the canvas. mercator is one of the projection, albersUsa can be used.
    var projection=d3.geo.albersUsa().scale(1000).translate([innerWidth/2,innerHeight/2]);
    var path=d3.geo.path().projection(projection);

    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    // load geographic data in SVG to draw map
    d3.queue()
        .defer(d3.json, 'data/topoJSONUSMap.json')
        .await(ready);



    var counties,states,exteriorStateBoundaries,interiorStateBoundaries,exteriorCountyBoundaries,interiorCountyBoundaries;
    function ready (error, mapUS) {

        if (error) throw error;

        counties=topojson.feature(mapUS, mapUS.objects.counties).features;
        states=topojson.feature(mapUS, mapUS.objects.states).features;
        exteriorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a === b; });
        interiorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a !== b; });
        exteriorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a === b; });
        interiorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a !== b; });


        if (regionType=="state"){

                // code to add properties to json file
            for (var i = 0; i < states.length; i++) {

                for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID) == parseInt(states[i].id)){

                        states[i].properties.variableValue=myArrayOfObjects[j].variableValue;
                        states[i].properties.stateName=myArrayOfObjects[j].stateName;
                        break;
                    }
                }
            }

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([0, -6])
                .html(function(d) {
                    if(d.properties.variableValue === undefined || d.properties.variableValue === null) return "<span style='color:white' >Data Unavailable</span>";
                    return "<span style='color:white' >"+d.properties.stateName+"</span> <span style='color:white'>" + d3.format("0.2s")(d.properties.variableValue) + "</span>";
                })
            SVG.call(tip);

            console.log(myArrayOfObjects.length+" off "+states.length+" state data recieved");


             group.selectAll("path")
                 .data(states)
             .enter().append("path")
             .attr("d", path)
             .attr("class","state")
             .on("mouseover", tip.show)
              .on("mouseout", tip.hide)
              .on("mouseenter", function(d,i){
                d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                .style({'stroke-opacity':1,'stroke':'#000', 'stroke-width': 1.1,  'stroke-linejoin': 'round', 'stroke-linecap' : 'round'})
               })
              .on("mouseleave", function(d,i){
                d3.select(this).transition().duration(300)
                .style({'stroke-opacity':1,'stroke':'#ddd', 'stroke-width': 1});
               })


                 // .on('mouseover', tip.show)
                 //.on('mouseout', tip.hide)
             .attr("fill", function(d) {
                 var value=d.properties.variableValue;
                 if(value === undefined || value === null) return "#bbb";
                 return colorScale(parseInt(value));
             })
             .on("click", function(d){
               // drawState(d,counties);

                 drawAllMaps(d.id);
             });

            // legends

            var legendGroup=SVG.append("g");

            var legend=legendGroup.selectAll('g.legendEntry')
                .data(colorScale.range())   //.reverse()
                .enter()
                .append('g').attr('class', 'legendEntry');

            legend
                .append('rect')
                .attr("x", function(d,i){
                    return innerWidth-180-i*60;})
                .attr("y", function(d, i) {
                    return innerHeight-560;
                })
                .attr("width", 60)
                .attr("height", 8)
                .style("stroke", "black")
                .style("stroke-width", 1)
                .style("fill", function(d){return d;});
            //the data objects are the fill colors

            legend
                .append('text')
                .style("font-family","Arial, Helvetica, sans-serif")
                .style("font-size","10")
                .attr("x", function(d,i){
                    return innerWidth-180-i*60+3;}) //leave 5 pixel space after the <rect>
                .attr("y", function(d, i) {
                    return innerHeight-560;
                })
                .attr("dy", "2.1em") //place text one line *below* the x,y point
                .text(function(d,i) {
                    var extent = colorScale.invertExtent(d);
                    //extent will be a two-element array, format it however you want:
                    var format = d3.format("0.2s");
                    return format(+extent[1]) + " - " + format(+extent[0]);
                });
             //

        }
        else{

            console.log(myArrayOfObjects.length+" off "+counties.length+" counties data recieved");

            // code to add properties to json file
            for (var i = 0; i < counties.length; i++) {

                for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID+myArrayOfObjects[j].countyID) == parseInt(counties[i].id)) {
                        counties[i].properties.variableValue=myArrayOfObjects[j].variableValue;
                        counties[i].properties.countyName=myArrayOfObjects[j].countyName;
                        break;
                    }
                }
            }

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([0, 0])
                .html(function(d) {
                    if(d.properties.variableValue === undefined || d.properties.variableValue === null) return "<span style='color:white' >Data Unavailable</span>";
                    return "<span style='color:white' >"+d.properties.countyName+"</span> <span style='color:white'>" + d3.format("0.2s")(d.properties.variableValue) + "</span>";
                })
            SVG.call(tip);


            //drawing counties with state internal boundaries
            group.selectAll("path")
                .data(counties)
                .enter().append("path")
                .attr("d", path)
                .attr("class","county")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on("mouseenter", function(d,i){
                    d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                    .style({'stroke-opacity':1,'stroke':'#000', 'stroke-width': 1.1,  'stroke-linejoin': 'round', 'stroke-linecap' : 'round'})
                })
                .on("mouseleave", function(d,i){
                    d3.select(this).transition().duration(300)
                    .style({'stroke-opacity':1,'stroke':'#ddd', 'stroke-width': 1});
                })
                .attr("fill", function(d) {
                    var value=d.properties.variableValue;
                    if(value === undefined || value === null) return "#bbb";
                    return colorScale(parseInt(value));
                })
                .on("click", function(d){
                    //drawCons(d);
                });
            //.on("click", countyclicked);

            //drawing overlapping lines
            group.append("path")
                .datum(interiorStateBoundaries)
                .attr("id", "state-borders")
                .attr("class", "overlappingBoundaries")
                .attr("d", path);


            var legendGroup=SVG.append("g");

            var legend=legendGroup.selectAll('g.legendEntry')
                .data(colorScale.range())   //.reverse()
                .enter()
                .append('g').attr('class', 'legendEntry');

            legend
                .append('rect')
                .attr("x", function(d,i){
                    return innerWidth-180-i*60;})
                .attr("y", function(d, i) {
                    return innerHeight-560;
                })
                .attr("width", 60)
                .attr("height", 8)
                .style("stroke", "black")
                .style("stroke-width", 1)
                .style("fill", function(d){return d;});
            //the data objects are the fill colors

            legend
                .append('text')
                .style("font-family","Arial, Helvetica, sans-serif")
                .style("font-size","10")
                .attr("x", function(d,i){
                    return innerWidth-180-i*60+3;}) //leave 5 pixel space after the <rect>
                .attr("y", function(d, i) {
                    return innerHeight-560;
                })
                .attr("dy", "2.1em") //place text one line *below* the x,y point
                .text(function(d,i) {
                    var extent = colorScale.invertExtent(d);
                    //extent will be a two-element array, format it however you want:
                    var format = d3.format("0.2s");
                    return format(+extent[1]) + " - " + format(+extent[0]);
                });
            //

        }



    }




}




function drawMiniMap(myArrayOfObjects) {



    // This function takes data as input and draws map.
    console.log("Painting map");

    // chart size
    var outerWidth = 345;
    var outerHeight = 300;
    var margin = { left: 10, top: 10, right: 10, bottom: 10 };
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    var SVG = d3.select("#det1").attr("width",innerWidth).attr("height",innerHeight);  // select SVG element on the DOM
    SVG.selectAll("g").remove();// remove previous  charts
    var group=SVG.append("g");// add group

    var variableArray = myArrayOfObjects.map(function(obj){
        return obj.variableValue;
    });

    // define colorscale function
    var colorScale = d3.scale.quantize()
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)","rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"]);

    colorScale.domain(d3.extent(variableArray));

    // projection defines how map is laidout on the canvas. mercator is one of the projection, albersUsa can be used.
    var projection=d3.geo.albersUsa().scale(400).translate([innerWidth/2,innerHeight/2]);
    var path=d3.geo.path().projection(projection);


    // load geographic data in SVG to draw map
    d3.queue()
        .defer(d3.json, 'data/topoJSONUSMap.json')
        .await(ready);

    var counties,states,exteriorStateBoundaries,interiorStateBoundaries,exteriorCountyBoundaries,interiorCountyBoundaries;
    function ready (error, mapUS) {

        if (error) throw error;

        counties=topojson.feature(mapUS, mapUS.objects.counties).features;
        states=topojson.feature(mapUS, mapUS.objects.states).features;
        exteriorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a === b; });
        interiorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a !== b; });
        exteriorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a === b; });
        interiorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a !== b; });


        if (regionType=="state"){

            // code to add properties to json file
            for (var i = 0; i < states.length; i++) {

                for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID) == parseInt(states[i].id)){

                        states[i].properties.variableValue=myArrayOfObjects[j].variableValue;
                        states[i].properties.stateName=myArrayOfObjects[j].stateName;
                        break;
                    }
                }
            }

            console.log(myArrayOfObjects.length+" off "+states.length+" state data recieved");


            group.selectAll("path")
                .data(states)
                .enter().append("path")
                .attr("d", path)
                .attr("class","state")
                .attr("fill", function(d) {
                    var value=d.properties.variableValue;
                    if(value === undefined || value === null) return "#bbb";
                    return colorScale(parseInt(value));
                })


        }
        else{

            console.log(myArrayOfObjects.length+" off "+counties.length+" counties data recieved");

            // code to add properties to json file
            for (var i = 0; i < counties.length; i++) {

                for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID+myArrayOfObjects[j].countyID) == parseInt(counties[i].id)) {
                        counties[i].properties.variableValue=myArrayOfObjects[j].variableValue;
                        counties[i].properties.countyName=myArrayOfObjects[j].countyName;
                        break;
                    }
                }
            }


            //drawing counties with state internal boundaries
            group.selectAll("path")
                .data(counties)
                .enter().append("path")
                .attr("d", path)
                .attr("class","county")
                .attr("fill", function(d) {
                    var value=d.properties.variableValue;
                    if(value === undefined || value === null) return "#bbb";
                    return colorScale(parseInt(value));
                });


            //drawing overlapping lines
            group.append("path")
                .datum(interiorStateBoundaries)
                .attr("id", "state-borders")
                .attr("class", "overlappingBoundaries")
                .attr("d", path);


        }



    }




}



function populateSelectionWidget4(){
    // loading first selection

    var selection1 = document.getElementById('selectionWidget1');
    var cursor1 = selection1.options[selection1.selectedIndex].value;

    var selection2 = document.getElementById('selectionWidget2');
    var cursor2 = selection2.options[selection2.selectedIndex].value;

    var selection3 = document.getElementById('selectionWidget3');
    var cursor3 = selection3.options[selection3.selectedIndex].value;

    var allNodes=$(xmlDoc).find(cursor1).find(cursor2).find(cursor3).children();
    var optionValues = [];
    for(i=0;i<allNodes.length;i++)
    {
        //optionValues.push(allNodes[i].nodeName.toString().replace(/_/g," "));
        var value=allNodes[i].nodeName.toString().split("_").join(" ");
        if(value.charAt(0)==" ") value=value.substring(1,value.length)
        // optionValues.push(value,allNodes[i].nodeName.toString());

        var keyValPair = {
            html: value,
            value: allNodes[i].nodeName.toString() }

        optionValues.push(keyValPair);


    }

    if (optionValues.length > 0) {
        console.log(optionValues);
        d3.select('#selectionWidget4').selectAll('option').data(optionValues).enter().append('option')
            .html(function (d) {
                return d.html
            })
            .attr('value', function (d) {
                return d.value;
            });

        // trigger for populating option for default option of next selection
        // populateSelectionWidget5();
    }
}





function populateSelectionWidget3(){
    // loading first selection

    var selection1 = document.getElementById('selectionWidget1');
    var cursor1 = selection1.options[selection1.selectedIndex].value;

    var selection2 = document.getElementById('selectionWidget2');
    var cursor2 = selection2.options[selection2.selectedIndex].value;

    var allNodes=$(xmlDoc).find(cursor1).find(cursor2).children();
    var optionValues = [];
    for(i=0;i<allNodes.length;i++)
    {
        //optionValues.push(allNodes[i].nodeName.toString().replace(/_/g," "));
        var value=allNodes[i].nodeName.toString().split("_").join(" ");
        if(value.charAt(0)==" ") value=value.substring(1,value.length)
        // optionValues.push(value,allNodes[i].nodeName.toString());

        var keyValPair = {
            html: value,
            value: allNodes[i].nodeName.toString() }

        optionValues.push(keyValPair);


    }

    if (optionValues.length > 0) {
        console.log(optionValues);
        d3.select('#selectionWidget3').selectAll('option').data(optionValues).enter().append('option')
            .html(function (d) {
                return d.html;
            })
            .attr('value', function (d) {
                return d.value;
            });
        // trigger for populating option for default option of next selection
        populateSelectionWidget4();
    }
}



function populateSelectionWidget2() {
    // loading first selection

    var selection1 = document.getElementById('selectionWidget1');
    var cursor1 = selection1.options[selection1.selectedIndex].value;

    var allNodes = $(xmlDoc).find(cursor1).children();
    var optionValues = [];
    for (i = 0; i < allNodes.length; i++) {
        //optionValues.push(allNodes[i].nodeName.toString().replace(/_/g," "));
        var value = allNodes[i].nodeName.toString().split("_").join(" ");
        if (value.charAt(0) == " ") value = value.substring(1, value.length)
        // optionValues.push(value,allNodes[i].nodeName.toString());

        var keyValPair = {
            html: value,
            value: allNodes[i].nodeName.toString()
        }

        optionValues.push(keyValPair);


    }

    if (optionValues.length > 0) {

    console.log(optionValues);
    d3.select('#selectionWidget2').selectAll('option').data(optionValues).enter().append('option')
        .html(function (d) {
            return d.html;
        })
        .attr('value', function (d) {
            return d.value;
        });
    // trigger for populating option for default option of next selection
    populateSelectionWidget3();
    }

}


function populateSelectionWidget1(){
    // loading first selection


   var allNodes=$(xmlDoc).find("TableCode").children();
    var optionValues = [];
    for(i=0;i<allNodes.length;i++)
    {
        //optionValues.push(allNodes[i].nodeName.toString().replace(/_/g," "));
        var value=allNodes[i].nodeName.toString().split("_").join(" ");
        if(value.charAt(0)==" ") value=value.substring(1,value.length)
           // optionValues.push(value,allNodes[i].nodeName.toString());

        var keyValPair = {
            html: value,
            value: allNodes[i].nodeName.toString() }

        optionValues.push(keyValPair);


    }

    console.log(optionValues);
    d3.select('#selectionWidget1').selectAll('option').data(optionValues).enter().append('option')
        .html(function(d) {
            return d.html;
        })
        .attr('value', function(d) {
            return d.value;
        });

    // trigger for populating option for default option of next selection
    populateSelectionWidget2();
}


function populateSelectionWidget6(){
    // fetch states

}

function populateSelectionWidget7(){
    //fetch counties

}

function main()
{

    defaultChoice1="Population_Within_The_Locality";
    defaultChoice2="Total";
    defaultChoice3="";
    defaultChoice4="";

    fetchData(defaultChoice1,defaultChoice2,defaultChoice3,defaultChoice4);

}

function loadXML()
{
    $.ajax({type: 'GET', url: 'data/tableCodes.xml' , dataType: 'xml' ,
        success: function(xml) {console.log("success"); xmlDoc=xml;

            deferredTask.resolve();
        },
        error: function(){console.log("Error: Something went wrong");} });
}

$(document).ready(function() {
    //here is a good spot to hookup other jQuery listeners
    d3.select("#back").on('click',function() {

        $('#main').css('display','block');
        $('#main2').css('display','none');
    });

    d3.select("#selectionWidget1")
        .on('change', function() {


            // remove options from 2,3,4,5
            d3.select('#selectionWidget2').selectAll('option').remove();
            d3.select('#selectionWidget3').selectAll('option').remove();
            d3.select('#selectionWidget4').selectAll('option').remove();
            d3.select('#selectionWidget5').selectAll('option').remove();

            // update widget 2
            populateSelectionWidget2();

            // call fetch data
            var selection1 = document.getElementById('selectionWidget1');
            var cursor1 =""
            if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

            var selection2 = document.getElementById('selectionWidget2');
            var cursor2="";
            if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

            var selection3 = document.getElementById('selectionWidget3');
            var cursor3 ="";
            if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

            var selection4 = document.getElementById('selectionWidget4');
            var cursor4 = "";
            if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;


            fetchData(cursor1,cursor2,cursor3,cursor4);

        });
    d3.select("#selectionWidget2")
        .on('change', function() {

            // remove options from 3,4,5
            d3.select('#selectionWidget3').selectAll('option').remove();
            d3.select('#selectionWidget4').selectAll('option').remove();
            d3.select('#selectionWidget5').selectAll('option').remove();

            // update widget 3
            populateSelectionWidget3();
            // call fetch data
            var selection1 = document.getElementById('selectionWidget1');
            var cursor1 =""
            if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

            var selection2 = document.getElementById('selectionWidget2');
            var cursor2="";
            if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

            var selection3 = document.getElementById('selectionWidget3');
            var cursor3 ="";
            if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

            var selection4 = document.getElementById('selectionWidget4');
            var cursor4 = "";
            if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;


            fetchData(cursor1,cursor2,cursor3,cursor4);
        });
    d3.select("#selectionWidget3")
        .on('change', function() {

            // remove options from 4,5
            d3.select('#selectionWidget4').selectAll('option').remove();
            d3.select('#selectionWidget5').selectAll('option').remove();
            // update options 4
            populateSelectionWidget4();
            // call fetch data
            var selection1 = document.getElementById('selectionWidget1');
            var cursor1 =""
            if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

            var selection2 = document.getElementById('selectionWidget2');
            var cursor2="";
            if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

            var selection3 = document.getElementById('selectionWidget3');
            var cursor3 ="";
            if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

            var selection4 = document.getElementById('selectionWidget4');
            var cursor4 = "";
            if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;


            fetchData(cursor1,cursor2,cursor3,cursor4);

        });
    d3.select("#selectionWidget4")
        .on('change', function() {

            // remove options from 5
            // update widget 5
            // call fetch data
            var selection1 = document.getElementById('selectionWidget1');
            var cursor1 =""
            if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

            var selection2 = document.getElementById('selectionWidget2');
            var cursor2="";
            if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

            var selection3 = document.getElementById('selectionWidget3');
            var cursor3 ="";
            if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

            var selection4 = document.getElementById('selectionWidget4');
            var cursor4 = "";
            if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;

            fetchData(cursor1,cursor2,cursor3,cursor4);



        });

    $('input[type=radio][name=distribution]').on('change', function() {

        var selection1 = document.getElementById('selectionWidget1');
        var cursor1 =""
        if(selection1.options.length>0)  cursor1 =selection1.options[selection1.selectedIndex].value;

        var selection2 = document.getElementById('selectionWidget2');
        var cursor2="";
        if(selection2.options.length>0)  cursor2 = selection2.options[selection2.selectedIndex].value;

        var selection3 = document.getElementById('selectionWidget3');
        var cursor3 ="";
        if(selection3.options.length>0) cursor3=selection3.options[selection3.selectedIndex].value;

        var selection4 = document.getElementById('selectionWidget4');
        var cursor4 = "";
        if(selection4.options.length>0) cursor4=selection4.options[selection4.selectedIndex].value;

        switch($(this).val()) {
            case 'State':
                regionType="state";
                fetchData(cursor1,cursor2,cursor3,cursor4);
                break;
            case 'County':
                regionType="county";
                fetchData(cursor1,cursor2,cursor3,cursor4);
                break;
        }
    });

    $('input[type=radio][name=distribution2]').on('change', function() {

        var options1=d3.select(".optState");
        var options2=d3.select(".optCounty");

        switch($(this).val()) {
            case 'State':
                regionType="state";
                options1.style({'display':'block'});
                options2.style({'display':'none'});
                break;
            case 'County':
                regionType="county";
                options1.style({'display':'none'});
                options2.style({'display':'block'});

                break;
        }
    });

    d3.select("#selectionWidget6")
        .on('change', function() {

            var selection6 = document.getElementById('selectionWidget6');
            var id="06";
            if(selection6.options.length>0)  id = selection6.options[selection6.selectedIndex].value;

            drawAllMaps(id)
        });

    d3.select("#selectionWidget7")
        .on('change', function() {

            var selection7 = document.getElementById('selectionWidget7');
            var id="06";
            if(selection7.options.length>0)  id = selection7.options[selection7.selectedIndex].value;

            drawAllMaps(id)
        });

    loadXML();
    $.when(xmlLoaded)
        .done ( function() {
            populateSelectionWidget1();
            populateSelectionWidget6();
            populateSelectionWidget7();
            main();
            });

});

