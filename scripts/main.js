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
var controlChoice1, controlChoice2, controlChoice3;
// on front end assign value of variable to each of the  control and then extract that to create final value of the varialble.

function generateTableCode()
{
    // This function generate tableCode to Query API. Later can be modified to Choose any make custome control Choice
    switch (controlChoice1) {

        case "Total Population":
            tableCode="B01003_001E";
            break;

        case "Age Distribution":
            tableCode="B01001_";

             switch (controlChoice2) {

                 case "Male":
                      switch (controlChoice3)
                      {
                          case "Under 5 Years":
                              tableCode=tableCode+"002E";
                              break;

                          default:
                              tableCode=tableCode+"001E";

                      }
                 break;

                 case "Female":
                     switch (controlChoice3)
                     {
                         case "Under 5 Years":
                             tableCode=tableCode+"027E";
                             break;

                         default:
                             tableCode=tableCode+"026E";

                     }
                     break;
             }
            break;
    }


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
    controlChoice1="Age Distribution";
    controlChoice2="Female";
    //This function generate table code.
    generateTableCode();
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
        // adding value as a property



        var states=topojson.feature(mapUS, mapUS.objects.states).features;

        var exteriorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a === b; });
        var interiorStateBoundaries=topojson.mesh(mapUS, mapUS.objects.states, function(a, b) { return a !== b; });
        var exteriorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a === b; });
        var interiorCountyBoundaries=topojson.mesh(mapUS, mapUS.objects.counties, function(a, b) { return a !== b; });





        if (regionType=="state"){

            console.log(myArrayOfObjects.length+" off "+states.length+" state data recieved");

             group.selectAll("path")
                 .data(states)
             .enter().append("path")
             .attr("d", path)
                 .attr("class","state")
             .attr("fill", function(d) {
                 for (var i = 0; i < myArrayOfObjects.length; i++) {
                     var value;
                     var notfound=true;
                     if (parseInt(myArrayOfObjects[i].stateID)==parseInt(d.id)) {
                         value = myArrayOfObjects[i].variableValue;
                         notfound=false;
                         break;
                     }

                 }
                 if(notfound)
                 {console.log("No match id,"+d.id);
                     return "#ccc";
                 }
                 return colorScale(value);

             }); // quantize take value and return value in the range of 9
             //.on("click", clicked);

        }
        else{

            console.log(myArrayOfObjects.length+" off "+counties.length+" counties data recieved");

            //drawing counties with state internal boundaries
            group.selectAll("path")
                .data(counties)
                .enter().append("path")
                .attr("d", path)
                .attr("class","county")
                .attr("fill", function(d) {
                    for (var i = 0; i < myArrayOfObjects.length; i++) {
                        var value;
                         var notfound=true;
                        if (parseInt(myArrayOfObjects[i].stateID+myArrayOfObjects[i].countyID)==parseInt(d.id)) {
                            value = myArrayOfObjects[i].variableValue;
                            notfound=false;
                            break;
                        }


                    }
                    if(notfound)
                    {console.log("No match id,"+d.id);
                        return "#ccc";
                    }
                    return colorScale(value);

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
    controlChoice1="Total Population";

    fetchData();

}

$(document).ready(function() {
    //here is a good spot to hookup other jQuery listeners
    main();
});

