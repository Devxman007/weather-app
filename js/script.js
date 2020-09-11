let loc = document.getElementById("location");
let tempIcon = document.getElementById("temp-icon");
let tempValue = document.getElementById("temp-value");
let climate = document.getElementById("climate");
let iconFile ;
window.addEventListener("load",() =>{
let long;
let lat;
if(navigator.geolocation)
{
        navigator.geolocation.getCurrentPosition((position) =>{
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const proxy ="https://cors-anywhere.herokuapp.com/";
        const api =`${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=37ccf27648070a6eaf80d1dfedc0e9b3`;
        fetch(api)
        .then((response) =>{
         return response.json();
        })
        .then(data => {
         const {name} = data;
         const {feels_like} = data.main;
         const {country} = data.sys;
         const {id , main, icon} = data.weather[0];
         loc.textContent = name;
         climate.textContent = main;
         tempValue.textContent = Math.round(feels_like-273.15);
         if(tempValue <250)
         {
             tempIcon.src ="./img/thunderstorm.svg";
         }
         else if (id <350)
         {
            tempIcon.src ="./img/rain.svg";
        }
         else if (id <550)
        {
             tempIcon.src ="./img/Sunny_Rain_Climate.svg";
         }
         else if (id <650)
         {
            tempIcon.src ="./img/Snow.svg";
        }
         else if (id <800)
         {
            tempIcon.src ="./img/Atmosphere.svg";
        }
         else if (id === 800)
         {
            tempIcon.src ="Hot_Sun_Day.svg";
        }
         else if (id > 800)
         {
            tempIcon.src ="./img/Sunny_Sun_Cloudy.svg";
        }
         console.log(data);
        })
    })
}
})