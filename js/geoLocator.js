// Get modal elements
const geoModal = document.getElementById("geoLocatorModal");
const openGeoModal = document.getElementById("openGeoLocator");
const closeGeoModal = document.querySelector(".geo-close");

// Open modal event
openGeoModal.addEventListener("click", () => {
    geoModal.style.display = "flex";
});

// Close modal event
closeGeoModal.addEventListener("click", () => {
    geoModal.style.display = "none";
});

// Close modal when clicking outside the content
window.addEventListener("click", (event) => {
    if (event.target === geoModal) {
        geoModal.style.display = "none";
    }
});

// Initialize Google Map
function initGeoMap() {
    const geoLocation = { lat: 6.5244, lng: 3.3792 }; // Example: Lagos, Nigeria
    const map = new google.maps.Map(document.getElementById("geoMap"), {
        zoom: 12,
        center: geoLocation
    });
    new google.maps.Marker({
        position: geoLocation,
        map: map,
        title: "Our Location"
    });
}

