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

    controlChoice1="Tota_Population_Within_The_Locality";
    controlChoice2="";
    controlChoice3="";

    //This function generate table code.
    generateTableCode(controlChoice1,controlChoice2,controlChoice3);
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
    var outerWidth = 760;
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
        .range(["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a",
                "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);

    colorScale.domain(d3.extent(variableArray));


    // projection defines how map is laidout on the canvas. mercator is one of the projection, albersUsa can be used.
    var projection=d3.geo.albersUsa().scale(800).translate([innerWidth/2,innerHeight/2]);

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
             .on("mouseover", function(d,i) {
                d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                .style({'stroke-opacity':1,'stroke':'#000', 'stroke-width': 1.1});
                
                //on hover tooltip
                div.transition()        
                .duration(200)      
                .style("opacity", .9); 
                div.text(d.properties.stateName+d.properties.variableValue)
                .style("left", (d3.event.pageX - 28) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");   

              })
              .on("mouseout", function(d,i) { 
                d3.select(this).transition().duration(300)
                .style({'stroke-opacity':1,'stroke':'#f4ecec', 'stroke-width': 1});

                div.transition()        
                .duration(500)      
                .style("opacity", 0);
              })
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
                .on("mouseover", function(d,i) {
                    d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                        .style({'stroke-opacity':1,'stroke':'#000', 'stroke-width': 1.1});

                    //on hover tooltip
                    div.transition()        
                    .duration(200)      
                    .style("opacity", .9); 
                    div.text(d.properties.countyName+d.properties.variableValue)
                    .style("left", (d3.event.pageX - 28) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
                  })
                 .on("mouseout", function(d,i) { 
                      d3.select(this).transition().duration(300)
                        .style({'stroke-opacity':1,'stroke':'#f4ecec', 'stroke-width': 1});

                        div.transition()        
                        .duration(500)      
                        .style("opacity", 0);
                    })
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


function populateSelectionWidgets(){
    // loading first selection


   var allNodes=$(xmlDoc).children().children();
    var optionValues = [];
    for(i=0;i<allNodes.length;i++)
    {
        //optionValues.push(allNodes[i].nodeName.toString().replace(/_/g," "));
        var value=allNodes[i].nodeName.toString().split("_").join(" ")
        if(value.charAt(0)==" ") value=value.substring(1,value.length)
            optionValues.push(value);
    }

    console.log(optionValues);
    d3.select('#selectionWidget1').selectAll('option').data(optionValues).enter().append('option')
        .html(function(d) {
            return d;
        })
        .attr('value', function(d) {
            return d;
        });
}


function main()
{
    populateSelectionWidgets();

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
    d3.select("#selectionWidget1")
        .on('change', function() {

            // remove options from 2,3,4,5
            // update widget 2
            // call fetch data

        });
    d3.select("#selectionWidget2")
        .on('change', function() {

            // remove options from 3,4,5
            // update widget 3
            // call fetch data
        });
    d3.select("#selectionWidget3")
        .on('change', function() {

            // remove options from 4,5
            // update options 4
            // call fetch data

        });
    d3.select("#selectionWidget4")
        .on('change', function() {

            // remove options from 5
            // update widget 5
            // call fetch data

        });

    $('input[type=radio][name=distribution]').on('change', function() {

        switch($(this).val()) {
            case 'State':
                regionType="state";
                fetchData();
                break;
            case 'County':
                regionType="county";
                fetchData();
                break;
        }
    });

    loadXML();
    $.when(xmlLoaded)
        .done ( function() {
            main();
            });

});

