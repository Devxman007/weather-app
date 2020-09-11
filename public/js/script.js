const loc = document.getElementById("location");
const tempIcon = document.getElementById("temp-icon");
const tempValue = document.getElementById("temp-value");
const climate = document.getElementById("climate");
const searchValue = document.getElementById("searchValue");
const searchButton = document.getElementById("searchBtn");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("searchValue", searchValue.value);
  if (searchValue.value === "") return;
  showCityWeather(searchValue.value);
});

window.addEventListener("load", () => {
  searchValue.value = localStorage.getItem("searchValue");
  if (searchValue.value !== "") showCityWeather(searchValue.value);
  else showCurrentLocationWeather();
});

function showCityWeather(cityName) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=37ccf27648070a6eaf80d1dfedc0e9b3`;
  fetchApi(api);
}

function showCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=37ccf27648070a6eaf80d1dfedc0e9b3`;
      fetchApi(api);
    });
  }
}

function fetchApi(api) {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rendreView(data);
    });
}

function rendreView(data) {
  const { name } = data;
  const { feels_like } = data.main;
  const { country } = data.sys;
  const { id, main, icon } = data.weather[0];
  loc.textContent = name;
  climate.textContent = main;
  tempValue.textContent = feels_like;

  if (id < 250) {
    tempIcon.src = "./img/thunderstorm.svg";
  } else if (id < 350) {
    tempIcon.src = "./img/rain.svg";
  } else if (id < 550) {
    tempIcon.src = "./img/Sunny_Rain_Climate.svg";
  } else if (id < 650) {
    tempIcon.src = "./img/Snow.svg";
  } else if (id < 800) {
    tempIcon.src = "./img/Atmosphere.svg";
  } else if (id === 800) {
    tempIcon.src = "./img/Hot_Sun_Day.svg";
  } else if (id > 800) {
    tempIcon.src = "./img/Sunny_Sun_Cloudy.svg";
  }
}
