// Set home location as target
let targetLocation = { latitude: 60.425749, longitude: 22.238295 }; // Your home coordinates
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

// Watch the user's position
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const distance = calculateDistance(userLat, userLon, targetLocation.latitude, targetLocation.longitude);

        if (distance < targetRadius) {
            document.getElementById("message").textContent = "You've reached the target! Here's your new clue!";
        } else {
            document.getElementById("message").textContent = `You're ${Math.round(distance)} meters away from the target.`;
        }
    });
} else {
    document.getElementById("message").textContent = "Geolocation is not supported by this browser.";
}
