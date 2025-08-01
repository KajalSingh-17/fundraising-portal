// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global state
let currentUser = null;
let allInterns = [];
let availableRewards = [];

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loadingOverlay = document.getElementById('loading-overlay');

// Auth forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginFormElement = document.getElementById('loginForm');
const signupFormElement = document.getElementById('signupForm');

// Dashboard elements
const dashboardContent = document.getElementById('dashboard-content');
const leaderboardContent = document.getElementById('leaderboard-content');
const dashboardNav = document.getElementById('dashboard-nav');
const leaderboardNav = document.getElementById('leaderboard-nav');

// User info elements
const userNameSpan = document.getElementById('user-name');
const referralCodeSpan = document.getElementById('referral-code');
const totalDonationsSpan = document.getElementById('total-donations');
const joinDateSpan = document.getElementById('join-date');
const userRewardsContainer = document.getElementById('user-rewards');
const availableRewardsContainer = document.getElementById('available-rewards');
const leaderboardBody = document.getElementById('leaderboard-body');

// Utility Functions
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// API Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function login(email, password) {
    return await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function signup(name, email, password) {
    return await apiCall('/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
}

async function fetchInterns() {
    return await apiCall('/interns');
}

async function fetchRewards() {
    return await apiCall('/rewards');
}

// Auth Functions
function switchToSignup() {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
}

function switchToLogin() {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    
    // Reset forms
    loginFormElement.reset();
    signupFormElement.reset();
    
    showNotification('Logged out successfully');
}

// Dashboard Functions
function showDashboard() {
    dashboardContent.classList.add('active');
    leaderboardContent.classList.remove('active');
    dashboardNav.classList.add('active');
    leaderboardNav.classList.remove('active');
}

function showLeaderboard() {
    leaderboardContent.classList.add('active');
    dashboardContent.classList.remove('active');
    leaderboardNav.classList.add('active');
    dashboardNav.classList.remove('active');
    
    // Load leaderboard data
    loadLeaderboard();
}

function populateUserInfo(user) {
    userNameSpan.textContent = user.name;
    referralCodeSpan.textContent = user.referralCode;
    totalDonationsSpan.textContent = formatCurrency(user.totalDonations);
    joinDateSpan.textContent = formatDate(user.joinDate);
}

function populateUserRewards(userRewards) {
    userRewardsContainer.innerHTML = '';
    
    if (userRewards.length === 0) {
        userRewardsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 40px;">
                <i class="fas fa-trophy" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <p>No rewards earned yet. Keep fundraising to unlock achievements!</p>
            </div>
        `;
        return;
    }
    
    userRewards.forEach(rewardName => {
        const reward = availableRewards.find(r => r.name === rewardName);
        if (reward) {
            const rewardCard = document.createElement('div');
            rewardCard.className = 'reward-card earned';
            rewardCard.innerHTML = `
                <div class="reward-icon">${reward.icon}</div>
                <h3>${reward.name}</h3>
                <p>${reward.description}</p>
                <div class="reward-threshold">Earned! ✓</div>
            `;
            userRewardsContainer.appendChild(rewardCard);
        }
    });
}

function populateAvailableRewards(userDonations) {
    availableRewardsContainer.innerHTML = '';
    
    availableRewards.forEach(reward => {
        const isEarned = userDonations >= reward.threshold;
        const rewardCard = document.createElement('div');
        rewardCard.className = `reward-card ${isEarned ? 'earned' : ''}`;
        rewardCard.innerHTML = `
            <div class="reward-icon">${reward.icon}</div>
            <h3>${reward.name}</h3>
            <p>${reward.description}</p>
            <div class="reward-threshold">
                ${isEarned ? 'Earned! ✓' : `Goal: ${formatCurrency(reward.threshold)}`}
            </div>
        `;
        availableRewardsContainer.appendChild(rewardCard);
    });
}

async function loadDashboardData() {
    try {
        showLoading();
        
        // Load available rewards
        const rewardsResponse = await fetchRewards();
        availableRewards = rewardsResponse.data;
        
        // Populate dashboard
        populateUserInfo(currentUser);
        populateUserRewards(currentUser.rewards || []);
        populateAvailableRewards(currentUser.totalDonations);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    } finally {
        hideLoading();
    }
}

async function loadLeaderboard() {
    try {
        showLoading();
        
        const internsResponse = await fetchInterns();
        allInterns = internsResponse.data;
        
        leaderboardBody.innerHTML = '';
        
        allInterns.forEach((intern, index) => {
            const rank = index + 1;
            const row = document.createElement('tr');
            
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
            
            row.innerHTML = `
                <td class="rank-cell ${rankClass}">
                    ${rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                </td>
                <td class="name-cell">${intern.name}</td>
                <td><span class="code-cell">${intern.referralCode}</span></td>
                <td class="amount-cell">${formatCurrency(intern.totalDonations)}</td>
                <td class="rewards-cell">
                    ${intern.rewards.slice(0, 3).map(reward => 
                        `<span class="mini-reward">${reward}</span>`
                    ).join('')}
                    ${intern.rewards.length > 3 ? `<span class="mini-reward">+${intern.rewards.length - 3}</span>` : ''}
                </td>
            `;
            
            leaderboardBody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showNotification('Error loading leaderboard', 'error');
    } finally {
        hideLoading();
    }
}

// Event Listeners
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading();
        const response = await login(email, password);
        currentUser = response.data;
        
        // Store user in localStorage for demo purposes
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Switch to dashboard
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        
        showNotification(`Welcome back, ${currentUser.name}!`);
        
        // Load dashboard data
        await loadDashboardData();
        
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    } finally {
        hideLoading();
    }
});

signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        showLoading();
        const response = await signup(name, email, password);
        
        showNotification(response.message);
        
        // Switch to login form
        switchToLogin();
        
        // Pre-fill email
        document.getElementById('loginEmail').value = email;
        
    } catch (error) {
        showNotification(error.message || 'Signup failed', 'error');
    } finally {
        hideLoading();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            authContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            loadDashboardData();
        } catch (error) {
            localStorage.removeItem('currentUser');
        }
    }
    
    hideLoading();
});

// Test data helper - for demo purposes
function fillTestData() {
    if (loginForm.classList.contains('active')) {
        document.getElementById('loginEmail').value = 'alex@example.com';
        document.getElementById('loginPassword').value = 'password123';
    } else {
        document.getElementById('signupName').value = 'John Doe';
        document.getElementById('signupEmail').value = 'john@example.com';
        document.getElementById('signupPassword').value = 'password123';
    }
}

// Add keyboard shortcut for demo (Ctrl+T to fill test data)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        fillTestData();
    }
});

// Make functions available globally for onclick handlers
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.logout = logout;
window.showDashboard = showDashboard;
window.showLeaderboard = showLeaderboard;