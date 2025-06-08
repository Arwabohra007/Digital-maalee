// Simple password hashing (basic obfuscation)
const hashPassword = (pw) => {
  // Simple obfuscation (note: not secure for production)
  return btoa(encodeURIComponent(pw + 'GARDEN_SALT'));
};

export const auth = {
  get users() {
    // Properly initialize users array
    const users = localStorage.getItem('garden_users');
    return users ? JSON.parse(users) : [];
  },

  set users(newUsers) {
    localStorage.setItem('garden_users', JSON.stringify(newUsers));
  },

  register(email, password) {
    if (this.users.some(u => u.email === email)) {
      throw new Error("Email already exists");
    }
    
    const newUser = { 
      id: Date.now().toString(),
      email, 
      password: hashPassword(password), // Store hashed password
      createdAt: new Date().toISOString()
    };
    
    // Update users correctly
    this.users = [...this.users, newUser];
    sessionStorage.setItem('garden_user', JSON.stringify(newUser));
    return newUser;
  },

  // ... rest of your auth methods
// const hashPassword = (pw) => btoa(pw + 'GARDEN_SALT');
// export const auth = {
//   users: JSON.parse(localStorage.getItem('garden_users') || '[]'), // Fixed empty array parsing

//   login(email, password) {
//     const user = this.users.find(u => 
//       u.email === email && 
//       u.password === hashPassword(password)
//     );
//     if (user) {
//       sessionStorage.setItem('garden_user', JSON.stringify(user));
//       return true;
//     }
//     return false;
//   },

//   register(email, password) {
//     if (this.users.some(u => u.email === email)) {
//       throw new Error("Email already exists");
//     }
    
//     const newUser = { 
//       id: Date.now().toString(),
//       email, 
//       password: hashPassword(password),
//       createdAt: new Date().toISOString()
//     };
    
//     this.users.push(newUser);
//     localStorage.setItem('garden_users', JSON.stringify(this.users));
//     sessionStorage.setItem('garden_user', JSON.stringify(newUser));
//     return newUser; // Return the new user
//   },

  logout() {
    sessionStorage.removeItem('garden_user');
  },

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('garden_user'));
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};