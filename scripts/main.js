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


function drawAllMaps(id)
{
    // set region type radio based on region type
    // show countie or state and set selected options to sate or county selection based on the regionType
    drawAgeDistibutionPieChart(id);
}

function drawAgeDistibutionPieChart(id) {

    

    var pieObjects=[]

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
        femalePopulation= parseFloat(results[0][1][1])
        totalPopulation= parseFloat(results[0][1][2])

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
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

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
        .attr("class","state")


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

