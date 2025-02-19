// Function to show a specific page and update active navigation link


function showPage(page) {
    let pages = document.querySelectorAll('.page');
    pages.forEach(function (pageElement) {
        pageElement.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');

    let links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="showPage('${page}')"]`).classList.add('active');
}

// Function to display user recharge history in a modal
function viewHistory(name, mobile, plan, date) {
    document.getElementById("userName").textContent = name;
    document.getElementById("userMobile").textContent = mobile;
    document.getElementById("lastRechargePlan").textContent = plan;
    document.getElementById("lastRechargeDate").textContent = date;
    var historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    historyModal.show();
}

// Function to notify user about plan expiry
function notifyUser(name, mobile) {
    alert(`Notification sent to ${name} (${mobile}): Your plan is going to expire soon! Please recharge to continue services.`);
}

// Search functionality for filtering subscriber list
document.getElementById('search').addEventListener('input', function () {
    let searchValue = this.value.toLowerCase();
    let rows = document.querySelectorAll('#subscriber-list tr');

    rows.forEach(row => {
        let name = row.cells[0].textContent.toLowerCase();
        let mobile = row.cells[1].textContent.toLowerCase();

        if (name.includes(searchValue) || mobile.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Function to filter recharge history based on date, payment mode, and plan type
function filterHistory() {
    let dateFilter = document.getElementById('filter-date').value;
    let paymentModeFilter = document.getElementById('filter-payment-mode').value.toLowerCase();
    let planTypeFilter = document.getElementById('filter-plan-type').value.toLowerCase();

    let rows = document.querySelectorAll('#history-table tbody tr');

    rows.forEach(row => {
        let date = row.cells[1].textContent;
        let paymentMode = row.cells[3].textContent.toLowerCase();
        let planName = row.cells[0].textContent.toLowerCase();

        if ((dateFilter === "" || date === dateFilter) &&
            (paymentModeFilter === "" || paymentMode.includes(paymentModeFilter)) &&
            (planTypeFilter === "" || planName.includes(planTypeFilter))) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to export recharge history as a CSV file
function exportData() {
    let table = document.getElementById("history-table");
    let rows = table.rows;
    let csvContent = "";

    for (let i = 0; i < rows.length; i++) {
        let rowData = [];
        let cols = rows[i].cells;
        for (let j = 0; j < cols.length; j++) {
            rowData.push(cols[j].innerText);
        }
        csvContent += rowData.join(",") + "\n";
    }

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'recharge_history.csv';
    hiddenElement.click();
}

// Function to export recharge history as a PDF file
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.autoTable({ html: '#history-table' });

    doc.save('recharge_history.pdf');
}

// List of available recharge plans

document.addEventListener("DOMContentLoaded", function () {
    let plans = [
        { name: "Basic Plan", price: 199, validity: "30 Days", dataBenefits: "1GB/Day", status: "active" },
        { name: "Standard Plan", price: 399, validity: "60 Days", dataBenefits: "1.5GB/Day", status: "active" },
        { name: "Premium Plan", price: 599, validity: "90 Days", dataBenefits: "2GB/Day", status: "inactive" }
    ];
    let editingIndex = null;

    function renderPlans() {
        const tbody = document.querySelector("#plans-table tbody");
        tbody.innerHTML = "";

        plans.forEach((plan, index) => {
            const row = `<tr>
                <td>${plan.name}</td>
                <td>₹${plan.price}</td>
                <td>${plan.validity}</td>
                <td>${plan.dataBenefits}</td>
                <td>${plan.status}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editPlan(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlan(${index})">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }

    window.openAddPlanModal = function () {
        document.getElementById("plan-form").reset();
        editingIndex = null;
    };

    window.handleFormSubmit = function (event) {
        event.preventDefault();

        const name = document.getElementById("plan-name").value;
        const price = document.getElementById("plan-price").value;
        const validity = document.getElementById("plan-validity").value;
        const dataBenefits = document.getElementById("plan-data-benefits").value;
        const status = document.getElementById("plan-status").value;

        const newPlan = { name, price, validity, dataBenefits, status };

        if (editingIndex !== null) {
            plans[editingIndex] = newPlan;
        } else {
            plans.push(newPlan);
        }

        renderPlans();
        bootstrap.Modal.getInstance(document.getElementById("addPlanModal")).hide();
    };

    window.editPlan = function (index) {
        const plan = plans[index];
        document.getElementById("plan-name").value = plan.name;
        document.getElementById("plan-price").value = plan.price;
        document.getElementById("plan-validity").value = plan.validity;
        document.getElementById("plan-data-benefits").value = plan.dataBenefits;
        document.getElementById("plan-status").value = plan.status;

        editingIndex = index;
        new bootstrap.Modal(document.getElementById("addPlanModal")).show();
    };

    window.deletePlan = function (index) {
        if (confirm("Are you sure you want to delete this plan?")) {
            plans.splice(index, 1);
            renderPlans();
        }
    };

    window.applyFilters = function () {
        const searchQuery = document.getElementById("search-plan-name").value.toLowerCase();
        const priceFilter = document.getElementById("filter-price").value;
        const statusFilter = document.getElementById("filter-status").value;

        let filteredPlans = [...plans];

        if (searchQuery) {
            filteredPlans = filteredPlans.filter(plan => plan.name.toLowerCase().includes(searchQuery));
        }

        if (priceFilter) {
            filteredPlans.sort((a, b) => priceFilter === "low-to-high" ? a.price - b.price : b.price - a.price);
        }

        if (statusFilter) {
            filteredPlans = filteredPlans.filter(plan => plan.status === statusFilter);
        }

        const tbody = document.querySelector("#plans-table tbody");
        tbody.innerHTML = "";

        filteredPlans.forEach((plan, index) => {
            const row = `<tr>
                <td>${plan.name}</td>
                <td>₹${plan.price}</td>
                <td>${plan.validity}</td>
                <td>${plan.dataBenefits}</td>
                <td>${plan.status}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editPlan(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlan(${index})">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    };

    window.exportPlans = function () {
        let csvContent = "Plan Name,Price,Validity,Data Benefits,Status\n";
        plans.forEach(plan => {
            csvContent += `${plan.name},${plan.price},${plan.validity},${plan.dataBenefits},${plan.status}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "plans.csv";
        link.click();
    };

    window.exportPDF = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Plan Management", 10, 10);

        let y = 20;
        plans.forEach(plan => {
            doc.text(`${plan.name} - ₹${plan.price} - ${plan.validity} - ${plan.dataBenefits} - ${plan.status}`, 10, y);
            y += 10;
        });

        doc.save("plans.pdf");
    };

    renderPlans();
});

// Notification Management

document.addEventListener('DOMContentLoaded', function () {
    // Sample Data for Notification History
    const subscribers = [
        { name: 'yuvasree', mobile: '9876543210' },
        { name: 'Subscriber', mobile: '8765432109' },
        { name: 'user2', mobile: '1234567890' }
    ];

    const notifications = [
        {
            id: 1,
            name: 'yuvasree',
            mobile: '9876543210',
            message: 'Your plan expires soon!',
            dateSent: '15-Feb-2025',
            status: 'Sent'
        },
        {
            id: 2,
            name: 'Subscriber',
            mobile: '8765432109',
            message: 'Recharge now & get 10% off',
            dateSent: '13-Feb-2025',
            status: 'Sent'
        },
        {
            id: 3,
            name: 'user2',
            mobile: '1234567890',
            message: 'Your subscription is pending confirmation.',
            dateSent: '17-Feb-2025',
            status: 'Pending'
        }
    ];

    // Populate Subscribers List for Datalist
    function loadSubscribers() {
        const subscriberList = document.getElementById('subscriberList');
        subscriberList.innerHTML = '';
        subscribers.forEach(function (subscriber) {
            const option = document.createElement('option');
            option.value = subscriber.name;
            subscriberList.appendChild(option);
        });
    }

    // Populate Notification History Table
    function loadNotifications() {
        const notificationHistoryList = document.getElementById('notificationHistoryList');
        notificationHistoryList.innerHTML = '';

        notifications.forEach(function (notification) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${notification.id}</td>
                <td>${notification.name}</td>
                <td>${notification.mobile}</td>
                <td>${notification.message}</td>
                <td>${notification.dateSent}</td>
                <td><span class="badge ${notification.status === 'Pending' ? 'bg-warning' : 'bg-success'}">${notification.status}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="resendNotification(${notification.id})" ${notification.status !== 'Pending' ? 'disabled' : ''}>Resend</button>
                </td>
            `;
            notificationHistoryList.appendChild(row);
        });
    }

    // Get the mobile number based on subscriber name
    function getMobileNumber(subscriberName) {
        const subscriber = subscribers.find(function (sub) {
            return sub.name === subscriberName;
        });
        return subscriber ? subscriber.mobile : '';
    }

    // Resend Notification Action
    window.resendNotification = function (id) {
        const notification = notifications.find(function (n) {
            return n.id === id;
        });
        if (notification && notification.status === 'Pending') {
            // Change status to Sent
            notification.status = 'Sent';
            loadNotifications(); // Re-load the notifications table to reflect the updated status
            alert(`Resending notification ID: ${id} to ${notification.name} at ${notification.mobile}`);
            // Implement the resend logic here, e.g., sending the notification again
        }
    };

    // Send Notification Functionality with Validation
    document.getElementById('notificationForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Clear previous invalid feedback
        const subscriberInput = document.getElementById('subscriberSelect');
        const messageInput = document.getElementById('messageContent');
        const form = this;

        let isValid = true;

        // Validate subscriber (Check if it's not empty)
        if (subscriberInput.value.trim() === '') {
            isValid = false;
            subscriberInput.classList.add('is-invalid');
            document.getElementById('subscriberFeedback').style.display = 'block';
        } else {
            subscriberInput.classList.remove('is-invalid');
            document.getElementById('subscriberFeedback').style.display = 'none';
        }

        // Validate message content (Check if it's not empty and has at least 10 characters)
        if (messageInput.value.trim() === '' || messageInput.value.trim().length < 10) {
            isValid = false;
            messageInput.classList.add('is-invalid');
            document.getElementById('messageFeedback').style.display = 'block';
        } else {
            messageInput.classList.remove('is-invalid');
            document.getElementById('messageFeedback').style.display = 'none';
        }

        // If everything is valid, submit the form
        if (isValid) {
            const subscriberName = subscriberInput.value;
            const message = messageInput.value;
            const mobile = getMobileNumber(subscriberName);

            if (!mobile) {
                alert('Subscriber not found!');
                return;
            }

            const newNotification = {
                id: notifications.length + 1,
                name: subscriberName,
                mobile: mobile,
                message: message,
                dateSent: new Date().toLocaleDateString(),
                status: 'Sent'
            };

            notifications.push(newNotification); // Add to the notification history
            loadNotifications(); // Re-load the notifications table
            alert('Notification sent successfully!');
            form.reset(); // Reset the form after submission (optional)
        }
    });

    // Search & Filter Functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        const filterValue = this.value.toLowerCase();
        const filteredNotifications = notifications.filter(function (notification) {
            return notification.name.toLowerCase().includes(filterValue) ||
                notification.message.toLowerCase().includes(filterValue) ||
                notification.status.toLowerCase().includes(filterValue);
        });

        // Re-populate the table with filtered results
        const notificationHistoryList = document.getElementById('notificationHistoryList');
        notificationHistoryList.innerHTML = '';

        filteredNotifications.forEach(function (notification) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${notification.id}</td>
                <td>${notification.name}</td>
                <td>${notification.mobile}</td>
                <td>${notification.message}</td>
                <td>${notification.dateSent}</td>
                <td><span class="badge ${notification.status === 'Pending' ? 'bg-danger' : 'bg-success'}">${notification.status}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="resendNotification(${notification.id})" ${notification.status !== 'Pending' ? 'disabled' : ''}>Resend</button>
                </td>
            `;
            notificationHistoryList.appendChild(row);
        });
    });

    // Initial Load
    loadSubscribers();
    loadNotifications();
});


// Profile Management
document.addEventListener("DOMContentLoaded", function () {
    const profileImageInput = document.getElementById("profileImageInput");
    const profileImage = document.getElementById("profileImage");
    const imageMessage = document.getElementById("imageMessage");
    const userName = document.getElementById("userName");
    const userNameMessage = document.getElementById("userNameMessage");
    const address = document.getElementById("address");
    const addressMessage = document.getElementById("addressMessage");
    const newPassword = document.getElementById("newPassword");
    const newPasswordMessage = document.getElementById("newPasswordMessage");
    const confirmNewPassword = document.getElementById("confirmNewPassword");
    const confirmNewPasswordMessage = document.getElementById("confirmNewPasswordMessage");
    const updateProfileBtn = document.getElementById("updateProfileBtn");
    const successMessage = document.getElementById("successMessage");

    profileImageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
            if (!validExtensions.includes(file.type)) {
                imageMessage.textContent = "Only PNG, JPG, and JPEG formats are allowed.";
                imageMessage.style.display = "block";
                return;
            }
            imageMessage.style.display = "none";
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    updateProfileBtn.addEventListener("click", function () {
        let valid = true;

        if (userName.value.trim() === "") {
            userNameMessage.textContent = "Name cannot be empty.";
            userNameMessage.style.display = "block";
            valid = false;
        } else {
            userNameMessage.style.display = "none";
        }

        if (address.value.trim() === "") {
            addressMessage.textContent = "Address cannot be empty.";
            addressMessage.style.display = "block";
            valid = false;
        } else {
            addressMessage.style.display = "none";
        }

        if (newPassword.value.trim() !== "" || confirmNewPassword.value.trim() !== "") {
            if (newPassword.value.length < 6) {
                newPasswordMessage.textContent = "Password must be at least 6 characters long.";
                newPasswordMessage.style.display = "block";
                valid = false;
            } else {
                newPasswordMessage.style.display = "none";
            }

            if (newPassword.value !== confirmNewPassword.value) {
                confirmNewPasswordMessage.textContent = "Passwords do not match.";
                confirmNewPasswordMessage.style.display = "block";
                valid = false;
            } else {
                confirmNewPasswordMessage.style.display = "none";
            }
        }

        if (valid) {
            successMessage.style.display = "block";
            setTimeout(() => { successMessage.style.display = "none"; }, 3000);
        }
    });
});
// Report and Analysis

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Revenue (₹)',
            data: [120000, 150000, 130500, 170200, 190000],
            backgroundColor: '#009688'
        }]
    }
});

const rechargePlanCtx = document.getElementById('rechargePlanChart').getContext('2d');
new Chart(rechargePlanCtx, {
    type: 'pie',
    data: {
        labels: ['Data Booster Plans', 'Unlimited Plans', 'Basic Plans', 'Popular Plans'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336']
        }]
    }
});

const paymentModeCtx = document.getElementById('paymentModeChart').getContext('2d');
new Chart(paymentModeCtx, {
    type: 'doughnut',
    data: {
        labels: ['UPI', 'Credit/Debit Card', 'Net Banking'],
        datasets: [{
            data: [50, 30, 15],
            backgroundColor: ['#673AB7', '#03A9F4', '#FF9800']
        }]
    }
});

const dailyRechargeCtx = document.getElementById('dailyRechargeChart').getContext('2d');
new Chart(dailyRechargeCtx, {
    type: 'line',
    data: {
        labels: ['08-Feb', '09-Feb', '10-Feb', '11-Feb', '12-Feb', '13-Feb', '14-Feb'],
        datasets: [{
            label: 'Transactions',
            data: [220, 250, 270, 300, 280, 320, 310],
            borderColor: '#009688',
            fill: false
        }]
    }
});

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};
