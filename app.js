// Define target locations and clues
let targets = [
    { latitude: 60.425749, longitude: 22.238295, clue: "Welcome home! Your next clue is near the park." },
    { latitude: 60.426500, longitude: 22.240000, clue: "You've reached the park! Look for the tallest tree for your next clue." },
    { latitude: 60.427000, longitude: 22.242500, clue: "You've reached the final spot! Enjoy the treasure!" }
];

let targetRadius = 50; // in meters
let currentTargetIndex = 0;

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

        const currentTarget = targets[currentTargetIndex];
        const distance = calculateDistance(userLat, userLon, currentTarget.latitude, currentTarget.longitude);

        if (distance < targetRadius) {
            document.getElementById("message").textContent = currentTarget.clue;

            // Move to the next target if available
            if (currentTargetIndex < targets.length - 1) {
                currentTargetIndex++;
            } else {
                document.getElementById("message").textContent += " You've completed the journey!";
            }
        } else {
            document.getElementById("message").textContent = `You're ${Math.round(distance)} meters away from the target.`;
        }
    });
} else {
    document.getElementById("message").textContent = "Geolocation is not supported by this browser.";
}
