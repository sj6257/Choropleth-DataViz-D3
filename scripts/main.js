/**
 * Created by Sandeep on 10/17/16.
 */


// Initialize Variable here.
const KEY="5e63ecf1481c019e28003690bccb25f9f97f5e64";
const defaultYEAR="2015";
const defaultRegionType="state";
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
            tableCode="B0101_";

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
                             tableCode=tableCode+"026";

                     }
                     break;
             }
            break;
    }


}


function createAPI()
{
    // This function takes control inputs and creates an API.
    // sample url for county: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=county:*&key=.
    // sample url for state: http://api.census.gov/data/2015/acs1?get=NAME,B01001_001E&for=state:*&key=.

    var year="2015";
    var regionType="state";
    generateTableCode()
    var url=baseURL+year+"/acs1?get="+tableCode+"&for="+regionType+":"+regionName+""+"&key="+KEY;
    console.log(url);
  return url;
}

function requestJSON(url,callback)
{

    d3.json(url, function(error, json) {
        if (error) {
            return console.warn(error);}
        else
        {
            console.log("Data: "+json);
            // when task is successful this call back return values of to await all.
            // first argument inform error status and second one gives back results.
            callback(null,json);
        }

    });

}


function fetchData()
{
    //This function takes API and fetch data.
    var url=createAPI();
    var dataFetchingQueue = d3.queue();

    dataFetchingQueue.defer(requestJSON,url);
    dataFetchingQueue.awaitAll(function(error,results) {
        if (error) {
            console.log("Error Occurred while fetching data!");
            throw error;
        }
        console.log("Gotcha !!");
        console.log(results);
        //if there is any pre-processing required we can call that function and user regualr defer there to control flow before drawing map.
        // Start drawing map now
        drawMap();
    });
}



function drawDefaultMap(data) {
    // This function default data and draws Default map.


}


function drawMap(data) {
    // This function takes data as input and draws map.
    console.log("Painting map")
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

