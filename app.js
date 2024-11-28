document.addEventListener("DOMContentLoaded", function() {
    const trackerContainer = document.getElementById("tracker-container");
    const messageElement = document.getElementById("message");
    const eulaContainer = document.getElementById("eula-container");
    const eulaContent = document.getElementById("eula-content");
    const readEulaButton = document.getElementById("read-eula");
    const acceptEulaButton = document.getElementById("accept-eula");
    const declineEulaButton = document.getElementById("decline-eula");
    const eulaButtons = document.getElementById("eula-buttons");

    // Define target location and radius
    let targetLocation = { latitude: 60.425749, longitude: 22.238295 }; // Example coordinates
    let targetRadius = 50; // in meters

    // Function to calculate distance
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // Start geolocation
    function startGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                function (position) {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    const distance = calculateDistance(userLat, userLon, targetLocation.latitude, targetLocation.longitude);

                    if (distance <= targetRadius) {
                        messageElement.textContent = "You have reached the target location!";
                    } else {
                        messageElement.textContent = `You're ${Math.round(distance)} meters away from the target.`;
                    }
                },
                function (error) {
                    messageElement.textContent = "Unable to retrieve your location.";
                }
            );
        } else {
            messageElement.textContent = "Geolocation is not supported by this browser.";
        }
    }

    // Scroll EULA quickly
    function scrollEula() {
        eulaContainer.scrollTop = 0;
        const scrollInterval = setInterval(() => {
            eulaContainer.scrollTop += 20; // Increase scroll speed
            if (eulaContainer.scrollTop + eulaContainer.clientHeight >= eulaContainer.scrollHeight) {
                clearInterval(scrollInterval);
                eulaContainer.style.display = "none";
                eulaButtons.style.display = "block";
                trackerContainer.style.display = "block";
                readEulaButton.style.display = "none";
            }
        }, 30); // Decrease interval time
    }

    // Load EULA content
    function loadEula() {
        fetch('eula.txt')
            .then(response => response.text())
            .then(text => {
                eulaContent.innerHTML = text.replace(/\n/g, '<br>');
            })
            .catch(error => {
                eulaContent.innerHTML = "Failed to load EULA.";
            });
    }

    // Event listeners
    readEulaButton.addEventListener("click", () => {
        trackerContainer.style.display = "none";
        eulaContainer.style.display = "block";
        loadEula();
        scrollEula();
    });

    acceptEulaButton.addEventListener("click", () => {
        eulaButtons.style.display = "none";
        trackerContainer.style.display = "block";
        readEulaButton.style.display = "none";
        messageElement.textContent = ""; // Clear the message
        startGeolocation();
    });

    declineEulaButton.addEventListener("click", () => {
        location.reload(); // Reload the page
    });
});