document.addEventListener('DOMContentLoaded', () => {
    const planets = document.querySelectorAll('.planet');
    const sun = document.querySelector('.sun');
    const solarSystemSection = document.querySelector('.solar-system-section');

    solarSystemSection.addEventListener('click', (event) => {
        if (event.target === solarSystemSection) {
            window.location.href = '3D solar system.html'; // Sostituisci con il percorso del tuo file desiderato
        }
    });

    planets.forEach(planet => {
        planet.addEventListener('mouseover', () => {
            const planetTitle = planet.getAttribute('title');
            planet.setAttribute('title', planetTitle); // Assicura che l'attributo title sia impostato correttamente
        });

        planet.addEventListener('click', () => {
            const planetName = planet.getAttribute('data-planet');
            handlePlanetClick(planetName);
        });
    });

    // Aggiungi evento mouseover per il sole
    sun.addEventListener('mouseover', () => {
        const sunTitle = sun.getAttribute('title');
        sun.setAttribute('title', sunTitle); // Assicura che l'attributo title sia impostato correttamente
    });

    sun.addEventListener('click', () => {
        const planetName = sun.getAttribute('data-planet');
        handlePlanetClick(planetName);
    });

    // Funzione per impostare la scala
    function SetScale(input) {
        // Legge il valore di input e lo converte in float
        var scale = parseFloat(input.value);

        // Aggiorna il valore di scala mostrato accanto all'input
        document.getElementById('scale-value').innerText = scale.toFixed(2);

        // Aggiorna le velocità utilizzando il valore di scale
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

    let animationEnabled = true; // Flag per controllare lo stato dell'animazione

    // Funzione per gestire il click su un pianeta
    function handlePlanetClick(planetName) {
        switch (planetName) {
            case 'Mercury':
                window.location.href = 'planet3d/mercury.html'; // Sostituisci con il percorso del tuo file per Mercurio
                break;
            case 'Venus':
                window.location.href = 'planet3d/venus.html'; // Sostituisci con il percorso del tuo file per Venere
                break;
            case 'Earth':
                window.location.href = 'planet3d/earth.html'; // Sostituisci con il percorso del tuo file per la Terra
                break;
            case 'Mars':
                window.location.href = 'planet3d/mars.html'; // Sostituisci con il percorso del tuo file per Marte
                break;
            case 'Jupiter':
                window.location.href = 'planet3d/jupiter.html'; // Sostituisci con il percorso del tuo file per Giove
                break;
            case 'Saturn':
                window.location.href = 'planet3d/saturn.html'; // Sostituisci con il percorso del tuo file per Saturno
                break;
            case 'Uranus':
                window.location.href = 'planet3d/uranus.html'; // Sostituisci con il percorso del tuo file per Urano
                break;
            case 'Neptune':
                window.location.href = 'planet3d/neptune.html'; // Sostituisci con il percorso del tuo file per Nettuno
                break;
            case 'Sun':
                window.location.href = 'planet3d/sun.html'; // Sostituisci con il percorso del tuo file per il Sole
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
            const planetradius = planet.clientWidth / 2;
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

    // Gestisci il cambio di stato del checkbox per l'animazione
    const animateCheckbox = document.getElementById('animateCheckbox');
    if (animateCheckbox) {
        animateCheckbox.addEventListener('change', () => {
            animationEnabled = animateCheckbox.checked;
            if (animationEnabled) {
                // Riavvia l'animazione se è stata riattivata
                animatePlanets(performance.now());
            }
        });
    }

    // Avvia l'animazione dei pianeti
    animatePlanets(performance.now());
});
