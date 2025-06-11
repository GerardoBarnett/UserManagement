/**
 * User Service Class
 * Handles data operations for users (CRUD)
 * Uses localStorage for persistence
 */
class UserService {
    constructor() {
        this.storageKey = 'userManagementApp_users';
        this.users = this.loadUsers();
    }

    /**
     * Load users from localStorage
     * @returns {Array} - Array of user objects
     */
    loadUsers() {
        try {
            const usersData = localStorage.getItem(this.storageKey);
            if (!usersData) return [];
            
            const parsedData = JSON.parse(usersData);
            return Array.isArray(parsedData) ? parsedData.map(userData => new UserModel(userData)) : [];
        } catch (error) {
            console.error('Error loading users from localStorage:', error);
            return [];
        }
    }

    /**
     * Save users to localStorage
     */
    saveUsers() {
        try {
            const usersData = this.users.map(user => user.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(usersData));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
            throw new Error('Failed to save users. Please try again.');
        }
    }

    /**
     * Get all users
     * @returns {Array} - Array of user objects
     */
    getAllUsers() {
        return [...this.users];
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {UserModel|null} - User object or null if not found
     */
    getUserById(id) {
        const user = this.users.find(user => user.id === id);
        return user || null;
    }

    /**
     * Add a new user
     * @param {Object} userData - User data
     * @returns {UserModel} - Created user object
     * @throws {Error} - If validation fails
     */
    addUser(userData) {
        const newUser = new UserModel(userData);
        const validation = newUser.validate();
        
        if (!validation.isValid) {
            throw new Error('Validation failed: ' + JSON.stringify(validation.errors));
        }
        
        // Check for duplicate email
        if (this.users.some(user => user.email === newUser.email)) {
            throw new Error('A user with this email already exists');
        }
        
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    /**
     * Update an existing user
     * @param {string} id - User ID
     * @param {Object} userData - User data to update
     * @returns {UserModel} - Updated user object
     * @throws {Error} - If user not found or validation fails
     */
    updateUser(id, userData) {
        const userIndex = this.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        const user = this.users[userIndex];
        
        // Check for duplicate email (excluding the current user)
        if (userData.email && userData.email !== user.email && 
            this.users.some(u => u.email === userData.email)) {
            throw new Error('A user with this email already exists');
        }
        
        user.update(userData);
        
        const validation = user.validate();
        if (!validation.isValid) {
            throw new Error('Validation failed: ' + JSON.stringify(validation.errors));
        }
        
        this.users[userIndex] = user;
        this.saveUsers();
        return user;
    }

    /**
     * Delete a user
     * @param {string} id - User ID
     * @returns {boolean} - Success flag
     * @throws {Error} - If user not found
     */
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        this.users.splice(userIndex, 1);
        this.saveUsers();
        return true;
    }

    /**
     * Search users by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} - Array of matching user objects
     */
    searchUsers(keyword) {
        if (!keyword) return this.getAllUsers();
        
        const searchTerm = keyword.toLowerCase();
        return this.users.filter(user => {
            return user.firstName.toLowerCase().includes(searchTerm) ||
                   user.lastName.toLowerCase().includes(searchTerm) ||
                   user.email.toLowerCase().includes(searchTerm) ||
                   user.phone.toLowerCase().includes(searchTerm) ||
                   user.role.toLowerCase().includes(searchTerm);
        });
    }
}