
const checks = document.querySelector('#check-boxes');
checks.addEventListener('click', ({target}) => {
  if (target.className === 'form-check-input') {
  const checkDiv = target.parentNode;
  const boxes = [...checkDiv.parentNode.children];
  const idx = boxes.indexOf(checkDiv);

  const formHTML = [
    `
    <div class="form-group row">
      <label class="col-1" for="inputCity">City</label>
      <input type="city" class="form-control" id="inputCity" placeholder="San Francisco"/>
    </div>
    `,
    `
    <div class="form-group">
      <label for="inputZipCode">Zip Code</label>
      <input type="zip" class="form-control mx-3" id="inputZipCode" placeholder="94103"/>
    </div>
    `,
    `
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="inputLat">Latitude</label>
          <input type="latitude" class="form-control" id="inputLat" placeholder="37.733795"/>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="inputLong">Longitude</label>
          <input type="longitude" class="form-control" id="inputLong" placeholder="-122.446747"/>
        </div>
      </div>
    </div>
    `];

  document.querySelector('#form-html').innerHTML = formHTML[idx] + `
  <button type="submit" class="btn btn-primary">Submit</button>
  `;
  }
});

function onSubmit(event) {
  event.preventDefault();

  let cityInput = document.querySelector('input[type = city]');
  let zipCodeInput = document.querySelector('input[type = zip]');
  let latInput = document.querySelector('input[type = latitude]');
  let longInput = document.querySelector('input[type = longitude]');

  let searchInput = '';

  if (cityInput) {
    searchInput = `q=${cityInput.value}`;
  } else if (zipCodeInput) {
    searchInput = `zip=${zipCodeInput.value}`;
  } else if (latInput && longInput) {
    searchInput = `lat=${latInput.value}&lon=${longInput.value}`;
  }

  let currentWeather = {};
  let forcastWeather = {};

  async function getData() {

    const currentDataPromise = axios.get(`https://api.openweathermap.org/data/2.5/weather?${searchInput}&units=imperial&APPID=b61ed9d3127f208223d9889aac5b9f48`)
      .then(response => response.data);

    const forcastPromise = axios.get(`https://api.openweathermap.org/data/2.5/forecast?${searchInput}&units=imperial&APPID=b61ed9d3127f208223d9889aac5b9f48`)
      .then(response => response.data);

    Promise.all([
      currentWeather = await currentDataPromise,
      forcastWeather = await forcastPromise
    ]);

    const {id, main, description, icon} = currentWeather.weather[0];
    const {temp, feels_like, temp_min, temp_max, humidity} = currentWeather.main;

    const currentWeatherHTML = `
    <div class="card w-75">
      <div class="card-body">
        <h3 class="card-title" id="current-weather-title">Current Weather for ${currentWeather.name}</h3>
        <div class="row align-items-center">
          <div class="float-left"><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></div>
          <div class="float-left display-4">${Math.round(temp)}&deg</div>
        </div>
        <div class="card-text">${main}</div>
        <div class="card-text">Feels Like ${Math.round(feels_like)}&deg</div>
        <div class="card-text">High: ${Math.round(temp_max)}&deg</div>
        <div class="card-text">Low: ${Math.round(temp_min)}&deg</div>
        <div class="card-text">Humidity: ${humidity}%</div>
      </div>
    </div>
    `;

    const forcastArr = forcastWeather.list.map(data => {
      const date = new Date(data.dt * 1000);
      const time = moment(date).format('LT');
      const day = moment(date).format('ddd');
      const dayLong = moment(date).format('MM/DD');
      const hourlyIcon = data.weather[0].icon;
      const hourlyDescription = data.weather[0].description;
      const hourlyTemp = Math.round(data.main.temp);
      const hourlyFeelsLike = Math.round(data.main.feels_like);
      const hourlyHumidity = data.main.humidity;
      const hourlyRowHTML = `
      <tr>
        <td scope="row">
          <div>${time}</div>
          <div class="text-muted">${day}, ${dayLong}</div>
        </td>
        <td class="p-0"><img src="http://openweathermap.org/img/wn/${hourlyIcon}@2x.png" style="width:60px"></td>
        <td>${hourlyDescription}</td>
        <td class="text-center">${hourlyTemp}&deg</td>
        <td class="text-center">${hourlyFeelsLike}&deg</td>
        <td class="text-center">${hourlyHumidity}%</td>
      </tr>
      `;
      return hourlyRowHTML;
    }).join('');

    const hourlyWeatherHTML = `
    <div class="card w-75">
        <div class="card-body">
          <h3 class="card-title mb-3">Hourly Weather</h3>
          <table class="table">
            <thead>
              <tr class="align-items-center">
                <th scope="col">TIME</th>
                <th scope="col"></th>
                <th scope="col">DESCRIPTION</th>
                <th scope="col" class="text-center">TEMP</th>
                <th scope="col" class="text-center">FEELS LIKE</th>
                <th scope="col" class="text-center">HUMIDITY</th>
              </tr>
            </thead>
            <tbody>${forcastArr}</tbody>
          </table>
        </div>
      </div>
    `;

    document.querySelector('#current-weather-card').innerHTML = currentWeatherHTML;

    document.querySelector('#hourly-weather-card').innerHTML = hourlyWeatherHTML;
  }
  getData();
}

const weatherForm = document.querySelector('form');
weatherForm.addEventListener('submit', onSubmit);