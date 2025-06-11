/**
 * User Controller Class
 * Connects the model, view, and service components
 * Handles application logic and user interactions
 */
class UserController {
    constructor() {
        this.userService = new UserService();
        this.userView = new UserView();
    }

    /**
     * Initialize the controller
     * Set up event bindings and render initial data
     */
    init() {
        // Bind view events to controller methods
        this.userView.bindFormSubmit(this.handleFormSubmit.bind(this));
        this.userView.bindCancelForm(this.handleCancelForm.bind(this));
        this.userView.bindEditUser(this.handleEditUser.bind(this));
        this.userView.bindDeleteUser(this.handleDeleteUser.bind(this));
        this.userView.bindSearchUsers(this.handleSearchUsers.bind(this));
        this.userView.bindNotificationClose();
        
        // Render initial user list
        this.refreshUserList();
    }

    /**
     * Refresh the user list display
     */
    refreshUserList() {
        const users = this.userService.getAllUsers();
        this.userView.renderUserList(users);
    }

    /**
     * Handle form submission (add or update user)
     * @param {Object} formData - Form data object
     */
    handleFormSubmit(formData) {
        try {
            // Clear any previous validation errors
            this.userView.clearValidationErrors();
            
            if (formData.id) {
                // Update existing user
                this.userService.updateUser(formData.id, formData);
                this.userView.showNotification('User updated successfully');
            } else {
                // Add new user
                this.userService.addUser(formData);
                this.userView.showNotification('User added successfully');
            }
            
            // Reset form and refresh user list
            this.userView.resetForm();
            this.refreshUserList();
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Check if it's a validation error
            if (error.message.includes('Validation failed:')) {
                try {
                    const validationErrors = JSON.parse(error.message.replace('Validation failed: ', ''));
                    this.userView.showValidationErrors(validationErrors);
                } catch (e) {
                    this.userView.showNotification(error.message, true);
                }
            } else {
                this.userView.showNotification(error.message, true);
            }
        }
    }

    /**
     * Handle cancel button click
     */
    handleCancelForm() {
        this.userView.resetForm();
    }

    /**
     * Handle edit user button click
     * @param {string} userId - User ID
     */
    handleEditUser(userId) {
        try {
            const user = this.userService.getUserById(userId);
            if (user) {
                this.userView.fillFormForEdit(user);
            } else {
                this.userView.showNotification('User not found', true);
            }
        } catch (error) {
            console.error('Edit user error:', error);
            this.userView.showNotification('Error loading user data', true);
        }
    }

    /**
     * Handle delete user button click
     * @param {string} userId - User ID
     */
    async handleDeleteUser(userId) {
        try {
            const user = this.userService.getUserById(userId);
            if (!user) {
                this.userView.showNotification('User not found', true);
                return;
            }
            
            // Ask for confirmation
            const confirmed = await this.userView.showConfirmation(
                `Are you sure you want to delete ${user.getFullName()}?`
            );
            
            if (confirmed) {
                this.userService.deleteUser(userId);
                this.userView.showNotification('User deleted successfully');
                this.refreshUserList();
            }
        } catch (error) {
            console.error('Delete user error:', error);
            this.userView.showNotification('Error deleting user', true);
        }
    }

    /**
     * Handle search users
     * @param {string} keyword - Search keyword
     */
    handleSearchUsers(keyword) {
        try {
            const users = this.userService.searchUsers(keyword);
            this.userView.renderUserList(users);
        } catch (error) {
            console.error('Search users error:', error);
            this.userView.showNotification('Error searching users', true);
        }
    }
}