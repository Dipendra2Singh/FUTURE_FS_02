// Global variables
let employees = [];
let currentEmployeeId = null;
let isEditMode = false;

// DOM elements
const employeesList = document.getElementById('employeesList');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const searchInput = document.getElementById('searchInput');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the application
// Check login status before loading employees
async function checkLogin() {
    try {
        const res = await fetch('/api/employees', { method: 'GET' });
        if (res.status === 401) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    } catch {
        window.location.href = 'login.html';
        return false;
    }
}

// On DOMContentLoaded, check login first
document.addEventListener('DOMContentLoaded', async function() {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/public/' || window.location.pathname === '/public/index.html') {
        const loggedIn = await checkLogin();
        if (!loggedIn) return;
        loadEmployees();
        setupEventListeners();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Add employee button
    addEmployeeBtn.addEventListener('click', openAddModal);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Form submission
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel buttons
    document.getElementById('cancelBtn').addEventListener('click', closeModals);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeModals);
    
    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === employeeModal) {
            closeModals();
        }
        if (event.target === deleteModal) {
            closeModals();
        }
    });
}

// Load employees from API
async function loadEmployees() {
    showLoading(true);
    try {
        const response = await fetch('/api/employees');
        if (!response.ok) {
            throw new Error('Failed to load employees');
        }
        employees = await response.json();
        renderEmployees(employees);
    } catch (error) {
        showNotification('Error loading employees: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Render employees in the grid (show only names)
function renderEmployees(employeesToRender) {
    if (employeesToRender.length === 0) {
        employeesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No employees found</h3>
                <p>${employees.length === 0 ? 'Get started by adding your first employee!' : 'No employees match your search criteria.'}</p>
            </div>
        `;
        return;
    }
    employeesList.innerHTML = employeesToRender.map(employee => `
        <div class="employee-card employee-name-card" data-id="${employee.id}" onclick="showEmployeeDetails(${employee.id})">
            <div class="employee-info">
                <h3>${escapeHtml(employee.name)}</h3>
            </div>
        </div>
    `).join('');
}

// Show employee details modal
function showEmployeeDetails(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    let modal = document.getElementById('employeeDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'employeeDetailsModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    renderEmployeeDetailsModal(employee, modal);
    modal.style.display = 'block';
    document.getElementById('closeDetailsModal').onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function renderEmployeeDetailsModal(employee, modal, editMode = false) {
    if (!editMode) {
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Employee Details</h2>
                    <span class="close" id="closeDetailsModal">&times;</span>
                </div>
                <div class="employee-details-modal-content">
                    <div class="detail-item"><span class="detail-label">Name:</span> <span class="detail-value">${escapeHtml(employee.name)}</span></div>
                    <div class="detail-item"><span class="detail-label">Email:</span> <span class="detail-value">${escapeHtml(employee.email)}</span></div>
                    <div class="detail-item"><span class="detail-label">Position:</span> <span class="detail-value">${escapeHtml(employee.position)}</span></div>
                    <div class="detail-item"><span class="detail-label">Department:</span> <span class="detail-value">${escapeHtml(employee.department)}</span></div>
                    <div class="detail-item"><span class="detail-label">Salary:</span> <span class="detail-value salary">₹${(employee.salary * 83).toLocaleString()}</span></div>
                    <div class="detail-item"><span class="detail-label">Hire Date:</span> <span class="detail-value">${formatDate(employee.hireDate)}</span></div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-edit" id="editEmployeeBtn">Edit</button>
                    <button class="btn btn-delete" id="deleteEmployeeBtn">Delete</button>
                </div>
            </div>
        `;
        document.getElementById('editEmployeeBtn').onclick = function() {
            renderEmployeeDetailsModal(employee, modal, true);
        };
        document.getElementById('deleteEmployeeBtn').onclick = function() {
            if (confirm('Are you sure you want to delete this employee?')) {
                deleteEmployeeById(employee.id, modal);
            }
        };
    } else {
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Employee</h2>
                    <span class="close" id="closeDetailsModal">&times;</span>
                </div>
                <form id="editEmployeeForm" class="employee-details-modal-content">
                    <div class="form-group">
                        <label for="editName">Name</label>
                        <input type="text" id="editName" name="name" value="${escapeHtml(employee.name)}" required />
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" name="email" value="${escapeHtml(employee.email)}" required />
                    </div>
                    <div class="form-group">
                        <label for="editPosition">Position</label>
                        <input type="text" id="editPosition" name="position" value="${escapeHtml(employee.position)}" required />
                    </div>
                    <div class="form-group">
                        <label for="editDepartment">Department</label>
                        <input type="text" id="editDepartment" name="department" value="${escapeHtml(employee.department)}" required />
                    </div>
                    <div class="form-group">
                        <label for="editSalary">Salary (USD)</label>
                        <input type="number" id="editSalary" name="salary" value="${employee.salary}" min="0" required />
                    </div>
                    <div class="form-group">
                        <label for="editHireDate">Hire Date</label>
                        <input type="date" id="editHireDate" name="hireDate" value="${employee.hireDate}" required />
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('cancelEditBtn').onclick = function() {
            renderEmployeeDetailsModal(employee, modal, false);
        };
        document.getElementById('editEmployeeForm').onsubmit = async function(e) {
            e.preventDefault();
            const updated = {
                name: document.getElementById('editName').value.trim(),
                email: document.getElementById('editEmail').value.trim(),
                position: document.getElementById('editPosition').value.trim(),
                department: document.getElementById('editDepartment').value.trim(),
                salary: document.getElementById('editSalary').value,
                hireDate: document.getElementById('editHireDate').value
            };
            try {
                const res = await fetch(`/api/employees/${employee.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                });
                if (!res.ok) {
                    const data = await res.json();
                    showNotification(data.message || 'Update failed', 'error');
                    return;
                }
                const updatedEmp = await res.json();
                // Update local array
                const idx = employees.findIndex(emp => emp.id === employee.id);
                if (idx !== -1) employees[idx] = updatedEmp;
                renderEmployees(employees);
                showNotification('Employee updated successfully!', 'success');
                modal.style.display = 'none';
            } catch (err) {
                showNotification('Network error', 'error');
            }
        };
    }
}

async function deleteEmployeeById(id, modal) {
    try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const data = await res.json();
            showNotification(data.message || 'Delete failed', 'error');
            return;
        }
        employees = employees.filter(emp => emp.id !== id);
        renderEmployees(employees);
        showNotification('Employee deleted successfully!', 'success');
        modal.style.display = 'none';
    } catch (err) {
        showNotification('Network error', 'error');
    }
}

// Open add employee modal
function openAddModal() {
    isEditMode = false;
    currentEmployeeId = null;
    document.getElementById('modalTitle').textContent = 'Add New Employee';
    employeeForm.reset();
    employeeModal.style.display = 'block';
    
    // Set default hire date to today
    document.getElementById('hireDate').value = new Date().toISOString().split('T')[0];
}

// Open edit employee modal
async function editEmployee(id) {
    isEditMode = true;
    currentEmployeeId = id;
    document.getElementById('modalTitle').textContent = 'Edit Employee';
    
    try {
        const response = await fetch(`/api/employees/${id}`);
        if (!response.ok) {
            throw new Error('Failed to load employee data');
        }
        const employee = await response.json();
        
        // Populate form fields
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('position').value = employee.position;
        document.getElementById('department').value = employee.department;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('hireDate').value = employee.hireDate;
        
        employeeModal.style.display = 'block';
    } catch (error) {
        showNotification('Error loading employee data: ' + error.message, 'error');
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(employeeForm);
    const employeeData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        position: formData.get('position').trim(),
        department: formData.get('department'),
        salary: formData.get('salary'),
        hireDate: formData.get('hireDate')
    };
    
    // Validation
    if (!employeeData.name || !employeeData.email || !employeeData.position || 
        !employeeData.department || !employeeData.salary || !employeeData.hireDate) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(employeeData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const url = isEditMode ? `/api/employees/${currentEmployeeId}` : '/api/employees';
        const method = isEditMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save employee');
        }
        
        const savedEmployee = await response.json();
        
        if (isEditMode) {
            // Update existing employee in the array
            const index = employees.findIndex(emp => emp.id === currentEmployeeId);
            if (index !== -1) {
                employees[index] = savedEmployee;
            }
            showNotification('Employee updated successfully!', 'success');
        } else {
            // Add new employee to the array
            employees.push(savedEmployee);
            showNotification('Employee added successfully!', 'success');
        }
        
        renderEmployees(employees);
        closeModals();
        
    } catch (error) {
        showNotification('Error saving employee: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Delete employee
function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    document.getElementById('deleteEmployeeName').textContent = employee.name;
    deleteModal.style.display = 'block';
    currentEmployeeId = id;
}

// Confirm delete
async function confirmDelete() {
    if (!currentEmployeeId) return;
    
    showLoading(true);
    
    try {
        const response = await fetch(`/api/employees/${currentEmployeeId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete employee');
        }
        
        // Remove employee from the array
        employees = employees.filter(emp => emp.id !== currentEmployeeId);
        renderEmployees(employees);
        showNotification('Employee deleted successfully!', 'success');
        closeModals();
        
    } catch (error) {
        showNotification('Error deleting employee: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderEmployees(employees);
        return;
    }
    
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
    );
    
    renderEmployees(filteredEmployees);
}

// Close all modals
function closeModals() {
    employeeModal.style.display = 'none';
    deleteModal.style.display = 'none';
    employeeForm.reset();
    currentEmployeeId = null;
    isEditMode = false;
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add animation styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 