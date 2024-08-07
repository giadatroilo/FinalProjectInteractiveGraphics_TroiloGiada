document.addEventListener('DOMContentLoaded', () => {
    const planets = document.querySelectorAll('.planet');
    const sun = document.querySelector('.sun');

    planets.forEach(planet => {
        planet.addEventListener('mouseover', () => {
            const planetTitle = planet.getAttribute('title');
            planet.setAttribute('title', planetTitle); 
        });

        planet.addEventListener('click', () => {
            const planetName = planet.getAttribute('data-planet');
            handlePlanetClick(planetName);
        });
    });

    sun.addEventListener('mouseover', () => {
        const sunTitle = sun.getAttribute('title');
        sun.setAttribute('title', sunTitle); 
    });

    sun.addEventListener('click', () => {
        const planetName = sun.getAttribute('data-planet');
        handlePlanetClick(planetName);
    });

    function SetScale(input) {
        var scale = parseFloat(input.value);

        document.getElementById('scale-value').innerText = scale.toFixed(2);

        const speeds = {
            Mercury: 47.9 * scale,
            Venus: 35.0 * scale,
            Earth: 29.8 * scale,
            Mars: 24.1 * scale,
            Jupiter: 13.1 * scale,
            Saturn: 9.7 * scale,
            Uranus: 6.8 * scale,
            Neptune: 5.4 * scale
        }; // km/s

        const internalspeeds = {
            Mercury: 3.02 * scale,
            Venus: 1.81 * scale,
            Earth: 465 * scale,
            Mars: 241 * scale,
            Jupiter: 12580 * scale,
            Saturn: 9870 * scale,
            Uranus: 2590 * scale,
            Neptune: 2680 * scale
        }; // m/s

        const sunspeed = 1933 * scale; // m/s
        return {
            speeds: speeds,
            internalspeeds: internalspeeds,
            sunspeed: sunspeed
        };
    }

    let animationEnabled = false; 

    function handlePlanetClick(planetName) {
        switch (planetName) {
            case 'Mercury':
                window.location.href = 'planet3d/mercury.html'; 
                break;
            case 'Venus':
                window.location.href = 'planet3d/venus.html';
                break;
            case 'Earth':
                window.location.href = 'planet3d/earth.html'; 
                break;
            case 'Mars':
                window.location.href = 'planet3d/mars.html'; 
                break;
            case 'Jupiter':
                window.location.href = 'planet3d/jupiter.html';
                break;
            case 'Saturn':
                window.location.href = 'planet3d/saturn.html'; 
                break;
            case 'Uranus':
                window.location.href = 'planet3d/uranus.html'; 
                break;
            case 'Neptune':
                window.location.href = 'planet3d/neptune.html'; 
                break;
            case 'Sun':
                window.location.href = 'planet3d/sun.html'; 
                break;
        }
    }

    function animatePlanets(timestamp) {
        if (!animationEnabled) {
            return; 
        }
        const { speeds, internalspeeds, sunspeed } = SetScale(document.getElementById('scale-input'));
        planets.forEach(planet => {
            const orbit = planet.parentElement;
            const planetName = planet.classList[1];
            const speed = speeds[planetName];
            const internalspeed = internalspeeds[planetName];
            const radius = orbit.clientWidth / 2;
            const time = timestamp * 0.00001 * speed;
            const internaltime = timestamp * 0.00001 * internalspeed;
            const angle = time % (2 * Math.PI);
            const internalangle = internaltime % (2 * Math.PI);
            const x = radius * Math.cos(angle) - radius - 10;
            const y = radius * Math.sin(angle) - 10;

            planet.style.transform = `translate(${x}px, ${y}px) rotate(${internalangle}rad)`;
        });
        const suntime = timestamp * 0.00001 * sunspeed;
        const sunangle = suntime % (2 * Math.PI);
        sun.style.transform  = `rotate(${sunangle}rad)`;

        requestAnimationFrame(animatePlanets);
    }

    const animateCheckbox = document.getElementById('animateCheckbox');
    if (animateCheckbox) {
        animateCheckbox.addEventListener('change', () => {
            animationEnabled = animateCheckbox.checked;
            if (animationEnabled) {
                animatePlanets(performance.now());
            }
        });
    }

    animatePlanets(performance.now());
});