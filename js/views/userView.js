/**
 * User View Class
 * Handles UI rendering and DOM interactions
 */
class UserView {
    constructor() {
        // Form elements
        this.userForm = document.getElementById('user-form');
        this.formTitle = document.getElementById('form-title');
        this.userIdInput = document.getElementById('user-id');
        this.firstNameInput = document.getElementById('first-name');
        this.lastNameInput = document.getElementById('last-name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.roleInput = document.getElementById('role');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        // Error message elements
        this.firstNameError = document.getElementById('first-name-error');
        this.lastNameError = document.getElementById('last-name-error');
        this.emailError = document.getElementById('email-error');
        this.phoneError = document.getElementById('phone-error');
        this.roleError = document.getElementById('role-error');
        
        // User list elements
        this.userTableBody = document.getElementById('user-table-body');
        this.noUsersMessage = document.getElementById('no-users-message');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        
        // Notification elements
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notification-message');
        this.notificationClose = document.getElementById('notification-close');
        
        // Confirmation dialog elements
        this.confirmationDialog = document.getElementById('confirmation-dialog');
        this.confirmationMessage = document.getElementById('confirmation-message');
        this.confirmYesBtn = document.getElementById('confirm-yes');
        this.confirmNoBtn = document.getElementById('confirm-no');
        this.overlay = document.getElementById('overlay');
    }

    /**
     * Reset the user form
     */
    resetForm() {
        this.userForm.reset();
        this.userIdInput.value = '';
        this.formTitle.textContent = 'Add New User';
        this.clearValidationErrors();
    }

    /**
     * Clear validation error messages
     */
    clearValidationErrors() {
        this.firstNameError.textContent = '';
        this.lastNameError.textContent = '';
        this.emailError.textContent = '';
        this.phoneError.textContent = '';
        this.roleError.textContent = '';
    }

    /**
     * Display validation errors
     * @param {Object} errors - Validation errors object
     */
    showValidationErrors(errors) {
        this.clearValidationErrors();
        
        if (errors.firstName) this.firstNameError.textContent = errors.firstName;
        if (errors.lastName) this.lastNameError.textContent = errors.lastName;
        if (errors.email) this.emailError.textContent = errors.email;
        if (errors.phone) this.phoneError.textContent = errors.phone;
        if (errors.role) this.roleError.textContent = errors.role;
    }

    /**
     * Fill the form with user data for editing
     * @param {UserModel} user - User object
     */
    fillFormForEdit(user) {
        this.formTitle.textContent = 'Edit User';
        this.userIdInput.value = user.id;
        this.firstNameInput.value = user.firstName;
        this.lastNameInput.value = user.lastName;
        this.emailInput.value = user.email;
        this.phoneInput.value = user.phone;
        this.roleInput.value = user.role;
        
        // Scroll to form
        this.userForm.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Render the user list
     * @param {Array} users - Array of user objects
     */
    renderUserList(users) {
        this.userTableBody.innerHTML = '';
        
        if (users.length === 0) {
            this.userTableBody.innerHTML = '';
            this.noUsersMessage.classList.remove('hidden');
            return;
        }
        
        this.noUsersMessage.classList.add('hidden');
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.getFullName()}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td class="action-buttons">
                    <button class="btn btn-edit" data-id="${user.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" data-id="${user.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            this.userTableBody.appendChild(row);
        });
    }

    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {boolean} isError - Whether it's an error message
     */
    showNotification(message, isError = false) {
        this.notificationMessage.textContent = message;
        this.notification.classList.remove('hidden', 'error');
        
        if (isError) {
            this.notification.classList.add('error');
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    /**
     * Hide the notification
     */
    hideNotification() {
        this.notification.classList.add('hidden');
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @returns {Promise} - Resolves with boolean (true for yes, false for no)
     */
    showConfirmation(message) {
        return new Promise((resolve) => {
            this.confirmationMessage.textContent = message;
            this.confirmationDialog.classList.remove('hidden');
            this.overlay.classList.remove('hidden');
            
            const handleYes = () => {
                this.hideConfirmation();
                resolve(true);
            };
            
            const handleNo = () => {
                this.hideConfirmation();
                resolve(false);
            };
            
            // Remove any existing event listeners
            this.confirmYesBtn.replaceWith(this.confirmYesBtn.cloneNode(true));
            this.confirmNoBtn.replaceWith(this.confirmNoBtn.cloneNode(true));
            
            // Get the new elements
            this.confirmYesBtn = document.getElementById('confirm-yes');
            this.confirmNoBtn = document.getElementById('confirm-no');
            
            // Add new event listeners
            this.confirmYesBtn.addEventListener('click', handleYes);
            this.confirmNoBtn.addEventListener('click', handleNo);
        });
    }

    /**
     * Hide confirmation dialog
     */
    hideConfirmation() {
        this.confirmationDialog.classList.add('hidden');
        this.overlay.classList.add('hidden');
    }

    /**
     * Get form data as an object
     * @returns {Object} - Form data object
     */
    getFormData() {
        return {
            id: this.userIdInput.value,
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            role: this.roleInput.value
        };
    }

    /**
     * Add event listener for form submission
     * @param {Function} handler - Form submission handler
     */
    bindFormSubmit(handler) {
        this.userForm.addEventListener('submit', event => {
            event.preventDefault();
            handler(this.getFormData());
        });
    }

    /**
     * Add event listener for form cancel button
     * @param {Function} handler - Cancel button handler
     */
    bindCancelForm(handler) {
        this.cancelBtn.addEventListener('click', handler);
    }

    /**
     * Add event listener for edit user button
     * @param {Function} handler - Edit button handler
     */
    bindEditUser(handler) {
        this.userTableBody.addEventListener('click', event => {
            if (event.target.classList.contains('btn-edit') || 
                event.target.parentElement.classList.contains('btn-edit')) {
                const button = event.target.closest('.btn-edit');
                const userId = button.dataset.id;
                handler(userId);
            }
        });
    }

    /**
     * Add event listener for delete user button
     * @param {Function} handler - Delete button handler
     */
    bindDeleteUser(handler) {
        this.userTableBody.addEventListener('click', event => {
            if (event.target.classList.contains('btn-delete') || 
                event.target.parentElement.classList.contains('btn-delete')) {
                const button = event.target.closest('.btn-delete');
                const userId = button.dataset.id;
                handler(userId);
            }
        });
    }

    /**
     * Add event listener for search
     * @param {Function} handler - Search handler
     */
    bindSearchUsers(handler) {
        // Search on button click
        this.searchBtn.addEventListener('click', () => {
            handler(this.searchInput.value.trim());
        });
        
        // Search on Enter key
        this.searchInput.addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                handler(this.searchInput.value.trim());
            }
        });
    }

    /**
     * Add event listener for notification close button
     */
    bindNotificationClose() {
        this.notificationClose.addEventListener('click', () => {
            this.hideNotification();
        });
    }
}