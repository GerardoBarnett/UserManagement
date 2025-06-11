/**
 * User Model Class
 * Defines the structure and validation for user data
 */
class UserModel {
    /**
     * Create a new user object
     * @param {Object} userData - User data object
     */
    constructor(userData = {}) {
        this.id = userData.id || this.generateId();
        this.firstName = userData.firstName || '';
        this.lastName = userData.lastName || '';
        this.email = userData.email || '';
        this.phone = userData.phone || '';
        this.role = userData.role || '';
        this.createdAt = userData.createdAt || new Date().toISOString();
        this.updatedAt = userData.updatedAt || new Date().toISOString();
    }

    /**
     * Generate a unique ID for a new user
     * @returns {string} - Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Get full name of the user
     * @returns {string} - Full name
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Update user data
     * @param {Object} userData - User data to update
     */
    update(userData) {
        this.firstName = userData.firstName || this.firstName;
        this.lastName = userData.lastName || this.lastName;
        this.email = userData.email || this.email;
        this.phone = userData.phone || this.phone;
        this.role = userData.role || this.role;
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Validate user data
     * @returns {Object} - Validation result with isValid flag and errors
     */
    validate() {
        const errors = {};

        // Validate first name
        if (!this.firstName.trim()) {
            errors.firstName = 'First name is required';
        } else if (this.firstName.length > 50) {
            errors.firstName = 'First name cannot exceed 50 characters';
        }

        // Validate last name
        if (!this.lastName.trim()) {
            errors.lastName = 'Last name is required';
        } else if (this.lastName.length > 50) {
            errors.lastName = 'Last name cannot exceed 50 characters';
        }

        // Validate email
        if (!this.email.trim()) {
            errors.email = 'Email is required';
        } else if (!this.isValidEmail(this.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate phone
        if (!this.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!this.isValidPhone(this.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        // Validate role
        if (!this.role.trim()) {
            errors.role = 'Role is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} - Is email valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if phone number is valid
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - Is phone valid
     */
    isValidPhone(phone) {
        // Allow formats like: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
        const phoneRegex = /^[\d\s\-\.\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/[\s\-\.\(\)]/g, '').length >= 10;
    }

    /**
     * Convert user object to plain object for storage
     * @returns {Object} - Plain user object
     */
    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}