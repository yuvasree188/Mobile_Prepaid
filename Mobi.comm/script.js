
    // Initialize the page by showing the default section
    document.addEventListener('DOMContentLoaded', function() {
        // Show the 'dashboard' section by default when the page loads
        showSection('dashboard');
    });

    function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

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
                let planData = {
                    price: planCard.dataset.price,
                    validity: planCard.dataset.validity,
                    data: planCard.dataset.data
                };

                // Redirect to recharge page with selected plan details
                window.location.href = `payment_simulation.html?price=${planData.price}&validity=${planData.validity}&data=${planData.data}`;
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

function filterPlanManagement() {
    // Get selected filter value
    var selectedFilter = document.getElementById("planFilter").value;

    // Get all plan categories and headings
    var allCategories = document.querySelectorAll(".plan-category");
    var headings = document.querySelectorAll(".plan-category h3");

    // Loop through all plan categories and headings
    allCategories.forEach(function(category) {
        var categoryName = category.getAttribute("data-category");
        var heading = category.querySelector("h3");

        // Show or hide category and heading based on the selected filter
        if (selectedFilter === "all" || categoryName === selectedFilter) {
            category.style.display = "block"; // Show plan category
            heading.style.display = "block";  // Show heading
        } else {
            category.style.display = "none";  // Hide plan category
            heading.style.display = "none";   // Hide heading
        }
    });
}