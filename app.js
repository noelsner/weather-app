let inputCity = '';
let inputZipCode = '';
let inputLat = '';
let inputLong = '';

function onSubmit(event) {
  event.preventDefault();

  inputCity = document.querySelector('input[type = city]').value;
  inputZipCode = document.querySelector('input[type = zip]').value;
  inputLat = document.querySelector('input[type = latitude]').value;
  inputLong = document.querySelector('input[type = longitude]').value;

  const searchInput = `q=${inputCity}`;

  async function getData() {
    const API = `api.openweathermap.org/data/2.5/weather?${searchInput}&APPID=b61ed9d3127f208223d9889aac5b9f48`;
    console.log(API);

    // const response = await axios.get(`api.openweathermap.org/data/2.5/weather?${searchInput}&APPID=b61ed9d3127f208223d9889aac5b9f48`);
    // const weatherData = response.data;
    // console.log(weatherData);

  }

  getData();
}

const weatherForm = document.querySelector('form');
weatherForm.addEventListener('submit', onSubmit);

/*
weatherForm.addEventListener('keyup', (flag)=> {
  city = document.querySelector('input[type = city]');
  zipCode = document.querySelector('input[type = zip]');
  lat = document.querySelector('input[type = latitude]');
  long = document.querySelector('input[type = longitude]');

  if(city.length !== 0) {
    zipCode.disabled = true;
    lat.disabled = true;
    long.disabled = true;
  }

  if(zipCode.length !== 0) {
    city.disabled = true;
    lat.disabled = true;
    long.disabled = true;
  }

  if(lat.length !== 0 || long.length !== 0) {
    city.disabled = true;
    zipCode.disabled = true;
  }

});
*/