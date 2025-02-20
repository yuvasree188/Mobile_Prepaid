function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none'; // Hides all sections
    });

    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block'; // Show the active section
    }

    // Update active link styling in the navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active'); // Remove active class from all links
    });

    // Find the corresponding navbar link and add the 'active' class
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active'); // Mark the clicked section as active
        }
    });
}

// Ensure the default section is shown when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard'); // Default section to show
});

function confirmLogout() {
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = "login.html";
        }
        return false;
    }

function goToNotifications() {
    showSection('notifications');
}


document.querySelector('.notification-icon').addEventListener('click', goToNotifications);

document.addEventListener("DOMContentLoaded", function () {
        let profileImage = document.getElementById("profileImage");
        let profileImageInput = document.getElementById("profileImageInput");
        let userNameField = document.getElementById("userName");
        let displayUserName = document.getElementById("displayUserName");
        let addressField = document.getElementById("address");
        let paymentPreference = document.getElementById("paymentPreference");
        let updateBtn = document.getElementById("updateProfileBtn");

        let userNameMessage = document.getElementById("userNameMessage");
        let addressMessage = document.getElementById("addressMessage");
        let paymentMessage = document.getElementById("paymentMessage");

        let profileUpdated = {
            imageChanged: false,
            name: userNameField.value.trim(),
            address: addressField.value.trim(),
            payment: paymentPreference.value
        };

        // Profile Image Update
        profileImageInput.addEventListener("change", function (event) {
            let file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    profileImage.src = e.target.result;
                    profileUpdated.imageChanged = true;
                };
                reader.readAsDataURL(file);
            }
        });

        // Update Button Click Event
        updateBtn.addEventListener("click", function () {
            let updatedName = userNameField.value.trim();
            let updatedAddress = addressField.value.trim();
            let updatedPayment = paymentPreference.value;

            // Reset messages
            userNameMessage.style.display = "none";
            addressMessage.style.display = "none";
            paymentMessage.style.display = "none";

            let changesMade = false;

            // Name Update
            if (updatedName !== profileUpdated.name) {
                profileUpdated.name = updatedName;
                displayUserName.textContent = updatedName;
                userNameMessage.textContent = "✔ Name updated successfully!";
                userNameMessage.style.display = "block";
                changesMade = true;
            }

            // Address Update
            if (updatedAddress !== profileUpdated.address) {
                profileUpdated.address = updatedAddress;
                addressMessage.textContent = "✔ Address updated successfully!";
                addressMessage.style.display = "block";
                changesMade = true;
            }

            // Payment Preference Update
            if (updatedPayment !== profileUpdated.payment) {
                profileUpdated.payment = updatedPayment;
                paymentMessage.textContent = "✔ Payment preference updated successfully!";
                paymentMessage.style.display = "block";
                changesMade = true;
            }

            // Profile Image Update
            if (profileUpdated.imageChanged) {
                addressMessage.textContent += "\n✔ Profile picture updated successfully!";
                addressMessage.style.display = "block";
                changesMade = true;
            }

            if (!changesMade) {
                addressMessage.textContent = "No changes were made.";
                addressMessage.style.display = "block";
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        const rechargeButtons = document.querySelectorAll(".recharge-btn");
        rechargeButtons.forEach(btn => {
            btn.addEventListener("click", function () {
                let planCard = this.closest(".plan-card");
                let params = new URLSearchParams();
                Array.from(planCard.attributes).forEach(attr => {
                    if (attr.name.startsWith("data-")) {
                        params.append(attr.name.substring(5), attr.value);
                    }
                });
                window.location.href = `payment_simulation.html?${params.toString()}`;
            });
        });
    });


// Add event listener to handle file selection for profile image update
profileImageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Create a URL for the selected image file
        const imageUrl = URL.createObjectURL(file);

        // Update profile image in the profile page
        profileImage.src = imageUrl;

        // Update avatar image in the navbar
        navbarAvatar.src = imageUrl;

        // Save the image URL to localStorage so it persists across page reloads
        localStorage.setItem("profileImage", imageUrl);
    }
});

// Plan management

function filterPlanManagement() {
    // Get selected filter value
    var selectedFilter = document.getElementById("planFilter").value.toLowerCase();

    // Get all plan cards
    var allCards = document.querySelectorAll(".plan-card");

    // Loop through all plan cards
    allCards.forEach(function(card) {
        var planName = card.getAttribute("data-name").toLowerCase();
        var category = card.closest(".plan-category");

        // Show or hide the card based on the selected filter
        if (selectedFilter === "all" || planName.includes(selectedFilter)) {
            card.style.display = "block"; // Show plan card
        } else {
            card.style.display = "none";  // Hide plan card
        }

        // Check if the category still has visible cards
        var visibleCards = category.querySelectorAll(".plan-card:not([style*='display: none'])");
        var heading = category.querySelector("h3");

        if (visibleCards.length > 0) {
            category.style.display = "block"; // Show category
            heading.style.display = "block";  // Show heading
        } else {
            category.style.display = "none";  // Hide category
            heading.style.display = "none";   // Hide heading
        }
    });
}


