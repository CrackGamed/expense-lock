const TOTAL_BALANCE = 4000;
const WEEKLY_LIMIT = 250;
const TOTAL_DAYS = 7;

function showCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    document.getElementById("currentDate").innerText =
        "Today: " + today.toLocaleDateString('en-IN', options);
}

// Load data or create fresh
let data = JSON.parse(localStorage.getItem("expenseData")) || {
    startDate: null,
    weeklySpent: 0,
    balanceLeft: TOTAL_BALANCE,
    weekNumber: 1
};

// Calculate days passed
function getDaysPassed() {
    const start = new Date(data.startDate);
    const today = new Date();
    return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

// Update UI
function updateUI() {
    document.getElementById("spent").innerText = data.weeklySpent;
    document.getElementById("balance").innerText = data.balanceLeft;
    document.getElementById("remaining").innerText =
        WEEKLY_LIMIT - data.weeklySpent;
    document.getElementById("weekNumber").innerText = data.weekNumber;

    if (!data.startDate) {
        document.getElementById("days").innerText = TOTAL_DAYS;
        return;
    }

    const daysPassed = getDaysPassed();
    document.getElementById("days").innerText =
        Math.max(TOTAL_DAYS - daysPassed, 0);
}

// Check budget status
function checkAlert() {
    if (!data.startDate) return;

    const daysPassed = getDaysPassed();

    if (daysPassed >= TOTAL_DAYS) {
    data.startDate = null;
    data.weeklySpent = 0;
    data.weekNumber += 1;

    localStorage.setItem("expenseData", JSON.stringify(data));
    updateUI();
    return;
    }


    if (data.totalSpent >= WEEKLY_LIMIT && getDaysPassed() < TOTAL_DAYS) {
        alert(
            `Budget exhausted!\nYou can spend your next ₹250 after ${TOTAL_DAYS - daysPassed} days.`
        );
    }
}

// Add expense
function addExpense() {
    const amount = Number(document.getElementById("amount").value);
    if (!amount || amount <= 0) return;

    // Weekly start
    if (!data.startDate) {
        data.startDate = new Date().toISOString();
    }

    // Block if weekly limit exceeded
    if (data.weeklySpent + amount > WEEKLY_LIMIT) {
        alert("Weekly limit exceeded. You cannot spend more this week.");
        return;
    }

    // Block if balance insufficient
    if (amount > data.balanceLeft) {
        alert("Insufficient balance.");
        return;
    }

    data.weeklySpent += amount;
    data.balanceLeft -= amount;

    localStorage.setItem("expenseData", JSON.stringify(data));
    document.getElementById("amount").value = "";

    updateUI();
    checkAlert();
}

function resetWeek() {
    const confirmReset = confirm(
        "Reset this week's spending?\nWeek number will remain the same."
    );

    if (!confirmReset) return;

    data.startDate = null;
    data.weeklySpent = 0;

    localStorage.setItem("expenseData", JSON.stringify(data));
    updateUI();
}


// On page load
showCurrentDate();
updateUI();
checkAlert();

