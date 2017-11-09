const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather info',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

  const encodedAddress = encodeURIComponent(argv.address);
  const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

axios.get(geocodeUrl + encodedAddress).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find address');
  }

  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  const darkskyAPI = 'https://api.darksky.net/forecast/a12d0c0d4785e06966cbed829aac8f47/';
  console.log(response.data.results[0].formatted_address);
  return axios.get(`${darkskyAPI}${lng},${lat}`);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`Current temperature: ${temperature}* F`);
  console.log(`Apparent temperature: ${apparentTemperature}* F`);
}).catch((error) => {
  if (error.code === "ENOTFOUND") {
    console.log('Unable to connect to API servers');
  } else {
    console.log(error.message);
  }
});
