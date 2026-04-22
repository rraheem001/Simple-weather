const textElement = document.getElementById('typing-text');
const phrase = "How's the sky looking today?";
let index = 0;
let isDeleting = false;
let speed = 100;

function type() {
    const currentText = phrase.substring(0, index);
    textElement.textContent = currentText;

    if (!isDeleting && index < phrase.length) {
        index++;
        speed = 100; 
    } else if (isDeleting && index > 0) {
        index--;
        speed = 50; 
    } else {
        isDeleting = !isDeleting;
        speed = isDeleting ? 2000 : 500; 
    }

    setTimeout(type, speed);
}

async function getWeather() {
    const query = document.getElementById('city').value || 'Lagos';
    
    try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const geoData = await geoRes.json();
        
        if (geoData[0]) {
            const { lat, lon, display_name } = geoData[0];
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`);
            const wData = await wRes.json();

            document.getElementById('out-city').innerText = display_name.split(',')[0] + ", Nigeria";
            document.getElementById('out-temp').innerText = Math.round(wData.current.temperature_2m) + "°C";
            document.getElementById('out-hum').innerText = wData.current.relative_humidity_2m + "%";
            document.getElementById('out-wind').innerText = wData.current.wind_speed_10m + " km/h";
            document.getElementById('out-desc').innerText = "Current Conditions";
        }
    } catch (err) {
        document.getElementById('out-desc').innerText = "Location not found";
    }
}

window.onload = () => {
    type(); 
    getWeather();
};