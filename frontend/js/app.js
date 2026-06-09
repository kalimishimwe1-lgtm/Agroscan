// AgroScan Rwanda - Frontend JavaScript
// API Configuration
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let currentScanId = null;

// ==================== API HELPER FUNCTIONS ====================
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `API Error: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTHENTICATION ====================
function showAuthModal(type) {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    if (type === 'register') {
        switchAuthTab('register');
    } else {
        switchAuthTab('login');
    }
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await apiCall('/auth/login', 'POST', { email, password });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        currentUser = response.user;
        
        updateUIAfterLogin();
        closeAuthModal();
        showToast('Login successful! Welcome back.', 'success');
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    try {
        const response = await apiCall('/auth/register', 'POST', {
            username: email.split('@')[0],
            email,
            password,
            firstName,
            lastName,
            userType: document.getElementById('regRole').value
        });
        
        showToast('Account created successfully! Please login.', 'success');
        document.getElementById('registerForm').reset();
        setTimeout(() => switchAuthTab('login'), 1500);
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    currentUser = null;
    updateUIAfterLogout();
    showToast('Logged out successfully', 'success');
}

function updateUIAfterLogin() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'flex';
    document.getElementById('navHistory').style.display = 'block';
    document.getElementById('history').style.display = 'block';
    document.getElementById('scanBtn').disabled = false;
    loadHistory();
}

function updateUIAfterLogout() {
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('registerBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('navHistory').style.display = 'none';
    document.getElementById('history').style.display = 'none';
    document.getElementById('scanBtn').disabled = true;
}

// ==================== CROP SCANNING ====================
let currentFile = null;
let mediaStream = null;

function startCamera() {
    const uploadContent = document.getElementById('uploadContent');
    const cameraPreview = document.getElementById('cameraPreview');
    
    uploadContent.style.display = 'none';
    cameraPreview.style.display = 'flex';
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            mediaStream = stream;
            document.getElementById('cameraVideo').srcObject = stream;
        })
        .catch(err => {
            showToast('Unable to access camera', 'error');
            uploadContent.style.display = 'block';
            cameraPreview.style.display = 'none';
        });
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
        const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
        displayImagePreview(file);
        stopCamera();
    }, 'image/jpeg', 0.95);
}

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    
    document.getElementById('uploadContent').style.display = 'block';
    document.getElementById('cameraPreview').style.display = 'none';
}

function removeImage() {
    currentFile = null;
    document.getElementById('uploadContent').style.display = 'block';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('scanBtn').disabled = true;
}

function displayImagePreview(file) {
    currentFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('uploadContent').style.display = 'none';
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('scanBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function performScan() {
    if (!currentFile || !currentUser) {
        showToast('Please upload an image and login first', 'error');
        return;
    }
    
    const cropId = document.getElementById('cropType').value;
    const notes = document.getElementById('notes').value;
    
    try {
        document.getElementById('scanLoading').style.display = 'block';
        document.getElementById('scanContainer').style.display = 'none';
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', currentFile);
        formData.append('userId', currentUser.id);
        formData.append('cropId', cropId);
        formData.append('notes', notes);
        
        const response = await fetch(`${API_URL}/scans/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Scan upload failed');
        }
        
        const data = await response.json();
        currentScanId = data.scanId;
        
        // Simulate AI analysis steps
        await simulateScanProgress();
        
        showScanResults();
        removeImage();
        
    } catch (error) {
        showToast(error.message, 'error');
        document.getElementById('scanLoading').style.display = 'none';
        document.getElementById('scanContainer').style.display = 'block';
    }
}

async function simulateScanProgress() {
    const steps = ['step1', 'step2', 'step3'];
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.getElementById(steps[i]).classList.add('active');
        if (i > 0) {
            document.getElementById(steps[i - 1]).classList.remove('active');
        }
    }
}

function showScanResults() {
    document.getElementById('scanLoading').style.display = 'none';
    document.getElementById('scanResults').style.display = 'block';
    
    // Mock results - in production, fetch from API
    const mockResults = {
        health: {
            status: 'healthy',
            confidence: 92,
            disease: null
        },
        detections: [
            { name: 'Healthy', confidence: 92, severity: 'none' }
        ]
    };
    
    displayHealthStatus(mockResults.health);
    displayDetections(mockResults.detections);
    displayRecommendations();
}

function displayHealthStatus(health) {
    const healthCard = document.getElementById('healthCard');
    const statusColor = health.status === 'healthy' ? '#10b981' : '#ef4444';
    const statusIcon = health.status === 'healthy' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    healthCard.innerHTML = `
        <div style="text-align: center; padding: 2rem; border-radius: 1rem; background: ${statusColor}20; border: 2px solid ${statusColor};">
            <i class="fas ${statusIcon}" style="font-size: 2.5rem; color: ${statusColor}; margin-bottom: 1rem;"></i>
            <h3 style="color: ${statusColor}; margin: 0.5rem 0;">${health.status.toUpperCase()}</h3>
            <p style="margin: 0; color: var(--text-light);">Confidence: ${health.confidence}%</p>
        </div>
    `;
}

function displayDetections(detections) {
    const detectionsGrid = document.getElementById('detectionsGrid');
    
    detectionsGrid.innerHTML = detections.map(detection => `
        <div class="detection-card">
            <h4>${detection.name}</h4>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${detection.confidence}%"></div>
            </div>
            <p>Confidence: ${detection.confidence}%</p>
            <span class="severity-badge ${detection.severity}">${detection.severity}</span>
        </div>
    `).join('');
}

function displayRecommendations() {
    const recommendationsSection = document.getElementById('recommendationsSection');
    
    recommendationsSection.innerHTML = `
        <h3>Treatment Recommendations</h3>
        <div class="recommendations-list">
            <div class="recommendation-item">
                <i class="fas fa-leaf"></i>
                <div>
                    <h4>Organic Treatment</h4>
                    <p>Use neem oil spray or copper sulfate solution. Apply every 7 days.</p>
                </div>
            </div>
            <div class="recommendation-item">
                <i class="fas fa-flask"></i>
                <div>
                    <h4>Chemical Treatment</h4>
                    <p>Apply fungicide containing mancozeb or chlorothalonil as per instructions.</p>
                </div>
            </div>
            <div class="recommendation-item">
                <i class="fas fa-sprout"></i>
                <div>
                    <h4>Prevention Tips</h4>
                    <p>Maintain proper spacing, avoid overhead watering, and remove infected leaves.</p>
                </div>
            </div>
        </div>
    `;
}

function newScan() {
    document.getElementById('scanResults').style.display = 'none';
    document.getElementById('scanContainer').style.display = 'block';
    document.getElementById('uploadContent').style.display = 'block';
    document.getElementById('imagePreview').style.display = 'none';
}

// ==================== SCAN HISTORY ====================
async function loadHistory() {
    if (!currentUser) return;
    
    try {
        const response = await apiCall(`/scans/history/${currentUser.id}?page=1&limit=10`);
        
        // Display stats
        const statsHtml = `
            <div class="stat-card">
                <h4>Total Scans</h4>
                <p>${response.pagination.total}</p>
            </div>
        `;
        document.getElementById('historyStats').innerHTML = statsHtml;
        
        // Display scans
        const historyGrid = document.getElementById('historyGrid');
        historyGrid.innerHTML = response.scans.map(scan => `
            <div class="history-card">
                <img src="/${scan.image_path}" alt="${scan.crop_name}">
                <div class="history-card-content">
                    <h4>${scan.crop_name}</h4>
                    <p>${new Date(scan.scan_date).toLocaleDateString()}</p>
                    <p class="status-${scan.status}">${scan.status.toUpperCase()}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// ==================== CONTACT FORM ====================
async function sendContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    try {
        await apiCall('/contact/submit', 'POST', {
            name,
            email,
            subject,
            message
        });
        
        showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactSubject').value = '';
        document.getElementById('contactMessage').value = '';
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== UTILITIES ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.textContent = message;
    
    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    }[type];
    
    toastIcon.className = `toast-icon fas ${iconClass}`;
    toast.className = `toast toast-${type}`;
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==================== DRAG & DROP ====================
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.backgroundColor = 'var(--primary-light)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'white';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                displayImagePreview(files[0]);
            }
        });
    }
    
    // File input change
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                displayImagePreview(e.target.files[0]);
            }
        });
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const userId = localStorage.getItem('userId');
        currentUser = { id: userId };
        updateUIAfterLogin();
    }
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ==================== ADDITIONAL STYLES ====================
const styles = `
    .auth-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--border-color);
    }

    .auth-tab {
        background: none;
        border: none;
        padding: 1rem;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
    }

    .auth-tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }

    .auth-form {
        display: block;
    }

    .auth-switch {
        text-align: center;
        margin-top: 1rem;
        color: var(--text-light);
    }

    .auth-switch a {
        color: var(--primary-color);
        text-decoration: none;
        cursor: pointer;
    }

    .detection-card {
        background: white;
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        border-radius: 0.5rem;
    }

    .confidence-bar {
        background: var(--bg-light);
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin: 0.5rem 0;
    }

    .confidence-fill {
        height: 100%;
        background: var(--primary-color);
    }

    .severity-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .severity-badge.mild {
        background: #dbeafe;
        color: #1e40af;
    }

    .severity-badge.moderate {
        background: #fef3c7;
        color: #92400e;
    }

    .severity-badge.severe {
        background: #fee2e2;
        color: #991b1b;
    }

    .severity-badge.none {
        background: #dcfce7;
        color: #166534;
    }

    .recommendations-list {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
    }

    .recommendation-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-light);
        border-radius: 0.5rem;
    }

    .recommendation-item i {
        font-size: 1.5rem;
        color: var(--primary-color);
        flex-shrink: 0;
    }

    .recommendation-item h4 {
        margin: 0 0 0.25rem 0;
    }

    .recommendation-item p {
        margin: 0;
        font-size: 0.9rem;
    }

    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        display: none;
        align-items: center;
        gap: 1rem;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    }

    .toast-success {
        background-color: #10b981;
        color: white;
    }

    .toast-error {
        background-color: #ef4444;
        color: white;
    }

    .toast-info {
        background-color: #3b82f6;
        color: white;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .history-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
    }

    .history-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }

    .history-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .history-card-content {
        padding: 1rem;
    }

    .history-card-content h4 {
        margin: 0 0 0.5rem 0;
    }

    .history-card-content p {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
    }

    .status-pending {
        color: #f59e0b;
    }

    .status-completed {
        color: #10b981;
    }

    .status-failed {
        color: #ef4444;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
