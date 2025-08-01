// Global variables
let currentUser = null;

// API base URL
const API_BASE = '';

// Utility functions
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getBadgeFromAmount(amount) {
    if (amount >= 10000) return 'Platinum';
    if (amount >= 5000) return 'Gold';
    if (amount >= 2000) return 'Silver';
    if (amount >= 1000) return 'Bronze';
    return 'None';
}

// Auth functions
function switchToRegister() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
}

function switchToLogin() {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = '/';
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Login failed. Please try again.', 'error');
                console.error('Login error:', error);
            }
        });
    }
    
    // Register functionality
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                const response = await fetch(`${API_BASE}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    showMessage('Registration successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('Registration failed. Please try again.', 'error');
                console.error('Registration error:', error);
            }
        });
    }
});

// Dashboard functionality
async function loadDashboard() {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = '/';
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    
    try {
        const response = await fetch(`${API_BASE}/api/user/${currentUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            
            // Update welcome message
            document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.name}!`;
            
            // Update stats cards
            document.getElementById('totalDonations').textContent = formatCurrency(user.totalDonations);
            document.getElementById('referralCode').textContent = user.referralCode;
            document.getElementById('referralCodeInput').value = user.referralCode;
            
            // Count unlocked rewards
            const unlockedCount = user.rewards.filter(r => r.unlocked).length;
            document.getElementById('unlockedRewards').textContent = unlockedCount;
            
            // Get user rank
            await updateUserRank(user.id);
            
            // Update progress bars
            updateProgressBars(user.totalDonations);
            
            // Display rewards
            displayRewards(user.rewards);
            
        } else {
            showMessage('Failed to load user data', 'error');
        }
    } catch (error) {
        showMessage('Failed to load dashboard data', 'error');
        console.error('Dashboard load error:', error);
    }
}

async function updateUserRank(userId) {
    try {
        const response = await fetch(`${API_BASE}/api/leaderboard`);
        const data = await response.json();
        
        if (data.success) {
            const userRank = data.leaderboard.find(u => u.name === currentUser.name);
            if (userRank) {
                document.getElementById('currentRank').textContent = `#${userRank.rank}`;
            }
        }
    } catch (error) {
        console.error('Rank update error:', error);
    }
}

function updateProgressBars(totalDonations) {
    const goals = [
        { id: 'bronze', amount: 1000, progressId: 'bronzeProgress', barId: 'bronzeBar' },
        { id: 'silver', amount: 2000, progressId: 'silverProgress', barId: 'silverBar' },
        { id: 'gold', amount: 5000, progressId: 'goldProgress', barId: 'goldBar' },
        { id: 'platinum', amount: 10000, progressId: 'platinumProgress', barId: 'platinumBar' }
    ];
    
    goals.forEach(goal => {
        const progress = Math.min((totalDonations / goal.amount) * 100, 100);
        const progressText = `${formatCurrency(totalDonations)} / ${formatCurrency(goal.amount)}`;
        
        document.getElementById(goal.progressId).textContent = progressText;
        document.getElementById(goal.barId).style.width = `${progress}%`;
        
        // Add completed class if goal is reached
        if (progress >= 100) {
            document.getElementById(goal.barId).classList.add('completed');
        }
    });
}

function displayRewards(rewards) {
    const rewardsGrid = document.getElementById('rewardsGrid');
    rewardsGrid.innerHTML = '';
    
    rewards.forEach(reward => {
        const rewardCard = document.createElement('div');
        rewardCard.className = `reward-card ${reward.unlocked ? 'unlocked' : 'locked'}`;
        
        rewardCard.innerHTML = `
            <div class="reward-icon">
                <i class="fas fa-medal"></i>
            </div>
            <h4>${reward.name}</h4>
            <p>${reward.description}</p>
            <div class="reward-status">
                ${reward.unlocked ? 
                    '<i class="fas fa-check-circle"></i> Unlocked!' : 
                    '<i class="fas fa-lock"></i> Locked'
                }
            </div>
        `;
        
        rewardsGrid.appendChild(rewardCard);
    });
}

// Leaderboard functionality
async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE}/api/leaderboard`);
        const data = await response.json();
        
        if (data.success) {
            const leaderboard = data.leaderboard;
            
            // Update podium (top 3)
            updatePodium(leaderboard);
            
            // Update full leaderboard table
            updateLeaderboardTable(leaderboard);
            
            // Update summary stats
            updateSummaryStats(leaderboard);
            
        } else {
            showMessage('Failed to load leaderboard data', 'error');
        }
    } catch (error) {
        showMessage('Failed to load leaderboard', 'error');
        console.error('Leaderboard load error:', error);
    }
}

function updatePodium(leaderboard) {
    const positions = ['firstPlace', 'secondPlace', 'thirdPlace'];
    
    positions.forEach((position, index) => {
        const element = document.getElementById(position);
        if (leaderboard[index]) {
            const user = leaderboard[index];
            element.querySelector('h3').textContent = user.name;
            element.querySelector('p').textContent = formatCurrency(user.totalDonations);
        }
    });
}

function updateLeaderboardTable(leaderboard) {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboard.forEach(user => {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        const badge = getBadgeFromAmount(user.totalDonations);
        const badgeClass = badge.toLowerCase();
        
        row.innerHTML = `
            <div class="rank-col">
                <span class="rank-number">#${user.rank}</span>
                ${user.rank <= 3 ? `<i class="fas fa-medal rank-${user.rank}"></i>` : ''}
            </div>
            <div class="name-col">
                <i class="fas fa-user-circle"></i>
                ${user.name}
            </div>
            <div class="code-col">${user.referralCode}</div>
            <div class="amount-col">${formatCurrency(user.totalDonations)}</div>
            <div class="badge-col">
                <span class="badge ${badgeClass}">${badge}</span>
            </div>
        `;
        
        tbody.appendChild(row);
    });
}

function updateSummaryStats(leaderboard) {
    const totalInterns = leaderboard.length;
    const totalRaised = leaderboard.reduce((sum, user) => sum + user.totalDonations, 0);
    const averageRaised = totalRaised / totalInterns;
    
    document.getElementById('totalInterns').textContent = totalInterns;
    document.getElementById('totalRaised').textContent = formatCurrency(totalRaised);
    document.getElementById('averageRaised').textContent = formatCurrency(averageRaised);
}

// Referral code functionality
function copyReferralCode() {
    const input = document.getElementById('referralCodeInput');
    input.select();
    document.execCommand('copy');
    showMessage('Referral code copied to clipboard!', 'success');
}

function shareOnFacebook() {
    const referralCode = document.getElementById('referralCodeInput').value;
    const message = `Help me reach my fundraising goal! Use my referral code: ${referralCode}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const referralCode = document.getElementById('referralCodeInput').value;
    const message = `Help me reach my fundraising goal! Use my referral code: ${referralCode}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
    const referralCode = document.getElementById('referralCodeInput').value;
    const message = `Help me reach my fundraising goal! Use my referral code: ${referralCode}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

// Check authentication on protected pages
function checkAuth() {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser && (window.location.pathname === '/dashboard' || window.location.pathname === '/leaderboard')) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Initialize auth check
checkAuth();