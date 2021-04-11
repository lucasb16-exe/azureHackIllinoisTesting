const fetch = require('node-fetch');
const NodeGeocoder = require('node-geocoder');
const geolib = require('geolib');
const axios = require("axios");

module.exports = async function (context, req) {
    //req to return array of addresses/meal preferences
    context.log('JavaScript HTTP trigger function processed a request.');
 
    // var body = req.body;

    // var addresses = body.addresses;

    // var preferences = body.preferences;

    const options = {
        provider: 'mapquest',
        apiKey: 'rLKw3a1ko2xWLFAEoGytMrrvQAeGF3TT'
    };
    
    const geocoder = NodeGeocoder(options);

    var preferences = ['burger', 'taco', 'ice cream'];

    var addresses = ['586 water tower road south manteno', '1250 south halsted street chicago', '233 S Wacker Dr, Chicago, IL'];
    
    var addressCoordinates = [];
    
    for(const address of addresses)
    {
        const res = await geocoder.geocode(address);
        addressCoordinates.push( {latitude: res[0]["latitude"], longitude: res[0]["longitude"]} );
    }

    var centerCoords = geolib.getCenterOfBounds(addressCoordinates);

    var testResult = await getNearbyRestaurants(centerCoords["latitude"], centerCoords["longitude"], preferences);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: testResult
        //name, image_url, restaurant url, center latitude, center longitude for map, 
    };
    context.done();
}

function getNearbyRestaurants(lat, long, preferences)
{
    const apiKey = "qnH0h-RxY3JAVSpweQ3A_nBknez1kbWxR06UPH_VLfMSSA1xd-2y5Nun_A5-adOtF2_X0jvuGuCjo-4ERDnS-BKZnJJKSh8D19fbIXlycODp9RZPkMZYKAAbECRxYHYx";

    let params = {
        categories: "coffee,burgers,italian",
        open_now: true,
        latitude: lat,
        longitude: long,
        limit: 20
    }

    let yelpREST = axios.create({
        baseURL: "https://api.yelp.com/v3/",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-type": "application/json",
        },
    })

    return new Promise(function (resolve, reject) {
        yelpREST("/businesses/search", {params: params}).then(({data})=> {
            console.log("about to resolve data");
            resolve(data);
        },
            (error) => {reject(error)}
        );
    })
    
    // other params to consider - price, open_now, open_at, attributes, sort_by?, radius instead of limit?
}