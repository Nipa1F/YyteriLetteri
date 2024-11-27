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

// Function to initialize geolocation tracking
function startGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                const distance = calculateDistance(userLat, userLon, targetLocation.latitude, targetLocation.longitude);

                if (distance < targetRadius) {
                    document.getElementById("message").textContent = "You've reached the target! Here's your new clue!";
                } else {
                    document.getElementById("message").textContent = `You're ${Math.round(distance)} meters away from the target.`;
                }
            },
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    showPermissionWarning();
                }
            }
        );
    } else {
        document.getElementById("message").textContent = "Geolocation is not supported by this browser.";
    }
}

// Function to display permission warning and retry
function showPermissionWarning() {
    const messageElement = document.getElementById("message");
    messageElement.textContent = "Location permission is required to use this feature.";

    const retryButton = document.createElement("button");
    retryButton.textContent = "Retry Location Access";
    retryButton.onclick = requestLocationPermission;

    messageElement.appendChild(document.createElement("br"));
    messageElement.appendChild(retryButton);
}

// Function to explicitly ask for location permission
async function requestLocationPermission() {
    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });

        if (permission.state === 'denied') {
            alert("Please enable location permissions in your browser settings.");
        } else {
            startGeolocation();
        }
    } catch (error) {
        console.error("Permissions API error:", error);
    }
}

// Initialize the app
startGeolocation();
