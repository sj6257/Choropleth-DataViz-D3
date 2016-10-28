/**
 * Created by Sandeep on 10/17/16.
 */


// Initialize Variable here.
const KEY="5e63ecf1481c019e28003690bccb25f9f97f5e64";
const defaultYEAR="2015";
const defaultRegionType="state";

var year="2015";
var regionType="county";     // can be set to "state" or "county' . remember this is case sensitive.
var regionName="*";   // represent all unless specified.
const baseURL="http://api.census.gov/data/";
var  tableCode="";
var xmlDoc;
var controlChoice1, controlChoice2, controlChoice3;
var deferredTask=new $.Deferred();
var xmlLoaded=deferredTask.promise();

// on front end assign value of variable to each of the  control and then extract that to create final value of the varialble.

function generateTableCode(controlChoice1,controlChoice2,controlChoice3)
{

    var node = $(xmlDoc).find(controlChoice1).find("Total");
    if(controlChoice2.length>1) {
        node=node.find(controlChoice2);
        if(controlChoice3.length>1) node=node.find(controlChoice3);
    }
    tableCode=node.text();




    // This function generate tableCode to Query API. Later can be modified to Choose any make custome control Choice
    /*
    switch (controlChoice1) {

        case "Total Population": tableCode="B01003_001E";
            break;

        case "Age Distribution":tableCode="B01001_";

             switch (controlChoice2) {

                 case "Male":
                      switch (controlChoice3)
                      {
                          case "Under 5 Years":tableCode=tableCode+"002E";break;
                          default:tableCode=tableCode+"001E";
                      }
                 break;

                 case "Female":
                     switch (controlChoice3)
                     {
                         case "Under 5 Years":tableCode=tableCode+"027E";break;
                         default:tableCode=tableCode+"026E";
                     }
                     break;
             }
            break;

        case "Median Age" : tableCode="B01002_";

            if(controlChoice2="Male") tableCode=tableCode+"002E";
            else if(controlChoice2="Female") tableCode=tableCode+"003E";
            else tableCode=tableCode+"001E"; // total median age

            break;

        case "Race" : tableCode="B02001_";

            if(controlChoice2="White Alone") tableCode=tableCode+"002E";
            else if(controlChoice2="Black or African American Alone") tableCode=tableCode+"003E";
            else if(controlChoice2="American Indian and Alaska Native Alone") tableCode=tableCode+"004E";
            else if(controlChoice2="Asian Alone") tableCode=tableCode+"005E";
            else if(controlChoice2="Native Hawaiian and Other Pacific Islander Alone") tableCode=tableCode+"006E";
            else if(controlChoice2="Some Other Race Alone") tableCode=tableCode+"007E";
            else if(controlChoice2="Two or More Races"){
                if(controlChoice3="Two Races Including Some Other Race")tableCode=tableCode+"009E";
                else if (controlChoice3="Two Races Including Some Other Race")tableCode=tableCode+"010E";
                tableCode=tableCode+"008E";
            }
            else tableCode=tableCode+"001E"; // total race

            break;

        case "Living arrangement for adults (18 years and over)": tableCode="B09021_";

            switch(controlChoice2){

                case "18 to 34 Years":
                    if(controlChoice3="Lives Alone") tableCode=tableCode+"009E";
                    else if(controlChoice3="Householder Living With Spouse or Spouse of Householder") tableCode=tableCode+"010E";
                    else if(controlChoice3="Householder Living With Unmarried Partner or Unmarried Partner of Householder") tableCode=tableCode+"011E";
                    else if(controlChoice3="Child of Householder") tableCode=tableCode+"012E";
                    else if(controlChoice3="Other Relatives") tableCode=tableCode+"013E";
                    else if(controlChoice3="Other Nonrelatives") tableCode=tableCode+"014E";
                    else tableCode=tableCode+"008E";
                    break;

                case "35 to 64 Years":
                    if(controlChoice3="Lives Alone") tableCode=tableCode+"016E";
                    else if(controlChoice3="Householder Living With Spouse or Spouse of Householder") tableCode=tableCode+"017E";
                    else if(controlChoice3="Householder Living With Unmarried Partner or Unmarried Partner of Householder") tableCode=tableCode+"018E";
                    else if(controlChoice3="Child of Householder") tableCode=tableCode+"019E";
                    else if(controlChoice3="Other Relatives") tableCode=tableCode+"020E";
                    else if(controlChoice3="Other Nonrelatives") tableCode=tableCode+"021E";
                    else tableCode=tableCode+"015E";
                    break;

                case "65 Years and over":
                    if(controlChoice3="Lives Alone") tableCode=tableCode+"023E";
                    else if(controlChoice3="Householder Living With Spouse or Spouse of Householder") tableCode=tableCode+"024E";
                    else if(controlChoice3="Householder Living With Unmarried Partner or Unmarried Partner of Householder") tableCode=tableCode+"025E";
                    else if(controlChoice3="Child of Householder") tableCode=tableCode+"026E";
                    else if(controlChoice3="Other Relatives") tableCode=tableCode+"027E";
                    else if(controlChoice3="Other Nonrelatives") tableCode=tableCode+"028E";
                    else tableCode=tableCode+"022E";
                    break;

                default:
                    if(controlChoice3="Lives Alone") tableCode=tableCode+"002E";
                    else if(controlChoice3="Householder Living With Spouse or Spouse of Householder") tableCode=tableCode+"003E";
                    else if(controlChoice3="Householder Living With Unmarried Partner or Unmarried Partner of Householder") tableCode=tableCode+"004E";
                    else if(controlChoice3="Child of Householder") tableCode=tableCode+"005E";
                    else if(controlChoice3="Other Relatives") tableCode=tableCode+"006E";
                    else if(controlChoice3="Other Nonrelatives") tableCode=tableCode+"007E";
                    else tableCode=tableCode+"001E";
                    break;
            }


            break;

        case "Median Household Income in the Past 12 Months (In 2015 Inflation-Adjusted Dollars)": tableCode="B19013_001E";
            break;

        case "Per Capita Income in the Past 12 Months (In 2015 Inflation-Adjusted Dollars)": tableCode="B19301_001E";
            break;

        case "Place of birth by nativity" : tableCode="C05002_";

            if(controlChoice2="Native") {
                if(controlChoice3="Born in State of Residence")tableCode=tableCode+"003E";
                else if (controlChoice3="Born in Other State in the United States")tableCode=tableCode+"004E";
                else if (controlChoice3="Born Outside the United States")tableCode=tableCode+"005E";
                else if (controlChoice3="Puerto Rico")tableCode=tableCode+"006E";
                else if (controlChoice3="U.S. Island Areas or Born Abroad of American Parent(S)")tableCode=tableCode+"007E";
                tableCode=tableCode+"002E";}
            else if(controlChoice2="Foreign Born") tableCode=tableCode+"008E";
            else tableCode=tableCode+"001E"; // total

            break;

        case "Income to poverty-level ratio" : tableCode="C17002_";
            if(controlChoice2="Under .50") tableCode=tableCode+"002E";
            else if(controlChoice2=".50 to .74") tableCode=tableCode+"003E";
            else if(controlChoice2=".75 to .99") tableCode=tableCode+"004E";
            else if(controlChoice2="1.00 to 1.24") tableCode=tableCode+"005E";
            else if(controlChoice2="1.25 to 1.49") tableCode=tableCode+"006E";
            else if(controlChoice2="1.50 to 1.74") tableCode=tableCode+"007E";
            else if(controlChoice2="1.75 to 1.84") tableCode=tableCode+"008E";
            else if(controlChoice2="1.85 to 1.99") tableCode=tableCode+"009E";
            else if(controlChoice2="2.00 to 2.99") tableCode=tableCode+"010E";
            else if(controlChoice2="3.00 to 3.99") tableCode=tableCode+"011E";
            else if(controlChoice2="4.00 to 4.99") tableCode=tableCode+"012E";
            else if(controlChoice2="5.00 and over") tableCode=tableCode+"013E";
            else tableCode=tableCode+"001E";
            break;

    }

*/

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



function fetchData()
{

    controlChoice1="TotaPopulationWithinTheLocality";
    controlChoice2="";
    controlChoice3="";

    //This function generate table code.
    generateTableCode(controlChoice1,controlChoice2,controlChoice3);
    // sample url for county: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=county:*&key=.
    // sample url for state: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=state:*&key=.
    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+regionName+""+"&key="+KEY;
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

        var variableColumn=0;
        var stateID=1;
        var countyID=2
        var myArrayOfObjects = [];

        for (var rowNumber = 1; rowNumber < results[0].length; rowNumber++) {
            // make an object to store myArrayOfObjects

            var keyValPair = {
                variableValue: parseFloat(results[0][rowNumber][variableColumn]),
                stateID: results[0][rowNumber][stateID],
                countyID: results[0][rowNumber][countyID],
            }

            myArrayOfObjects.push(keyValPair);
        }



        // Start drawing map now
        drawMap(myArrayOfObjects);
    });
}



function drawDefaultMap(data) {
    // This function default data and draws Default map.


}

function drawMap(myArrayOfObjects) {
    // This function takes data as input and draws map.
    console.log("Painting map");

    // chart size
    var outerWidth = 950;
    var outerHeight = 600;
    var margin = { left: 30, top: 30, right: 30, bottom: 30 };
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;


    // select SVG element on the DOM
    var SVG = d3.select("#main").attr("width",outerWidth).attr("height",outerHeight);

    // remove previous line charts
    SVG.selectAll("g").remove();

    // add group
    var group=SVG.append("g");

    // define colorscale function
    //var colorScale = d3.scale.quantize().range(d3.range(9).map(function(number) { return "level"+number}));

    var variableArray = myArrayOfObjects.map(function(obj){
        return obj.variableValue;
    });


    var colorScale = d3.scale.quantize()
                             //.range(d3.range(9).map(function(number) { return "level"+number}));
        .range(["rgb(247,251,255)","rgb(222,235,247)","rgb(198,219,239)","rgb(158,202,225)","rgb(107,174,214)",
                "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)"]);

    colorScale.domain(d3.extent(variableArray));


    // projection defines how map is laidout on the canvas. mercator is one of the projection, albersUsa can be used.
    var projection=d3.geo.albersUsa().scale(800).translate([innerWidth/2,innerHeight/2]);

    var path=d3.geo.path().projection(projection);



    // load geographic data in SVG to draw map
    d3.queue()
        .defer(d3.json, 'data/topoJSONUSMap.json')
        .await(ready);



    function ready (error, mapUS) {

        if (error) throw error;


        var counties=topojson.feature(mapUS, mapUS.objects.counties).features;
        var states=topojson.feature(mapUS, mapUS.objects.states).features;
        var exteriorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a === b; });
        var interiorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a !== b; });
        var exteriorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a === b; });
        var interiorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a !== b; });


        if (regionType=="state"){

                // code to add properties to json file
                for (var i = 0; i < states.length; i++) {

                    for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID) == parseInt(states[i].id)) {
                        states[i].properties.variableValue=myArrayOfObjects[j].variableValue;
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
                 if(value === undefined || value === null) return "#ccc";
                 return colorScale(parseInt(value));
             }); // quantize take value and return value in the range of 9
             //.on("click", clicked);

        }
        else{

            console.log(myArrayOfObjects.length+" off "+counties.length+" counties data recieved");

            // code to add properties to json file
            for (var i = 0; i < counties.length; i++) {

                for ( var j=0; j<myArrayOfObjects.length;j++ ){
                    if (parseInt(myArrayOfObjects[j].stateID+myArrayOfObjects[j].countyID) == parseInt(counties[i].id)) {
                        counties[i].properties.variableValue=myArrayOfObjects[j].variableValue;
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
                    if(value === undefined || value === null) return "#ccc";
                    return colorScale(parseInt(value));
                });
            //.on("click", countyclicked);

            //drawing overlapping lines
            group.append("path")
                .datum(interiorStateBoundaries)
                .attr("id", "state-borders")
                .attr("class", "overlappingBoundaries")
                .attr("d", path);

        }



    }




}

function main()
{


    fetchData();

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

    loadXML();
    $.when(xmlLoaded)
        .done ( function() {
            main();
            });

});

