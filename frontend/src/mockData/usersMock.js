// Sample user data with proper structure
export const users = [
  {
    _id: '67f6c0b05a8f631d3bc66a36',
    username: 'admin',
    password: '$2a$10$VuP.GV5kHU7gKcmBd.7yq.OH8UMKEp1Y2ZWmXuPRtHY9fJ/26A8Q2', // hashed 'abc123'
    email: 'admin@ellicottvilleskiclub.com',
    name: 'Admin User',
    position: 'Admin',
    isApproved: true,
    isAdmin: true
  },
  {
    _id: '67f6c0b05a8f631d3bc66a37',
    username: 'user',
    password: '$2a$10$VuP.GV5kHU7gKcmBd.7yq.OH8UMKEp1Y2ZWmXuPRtHY9fJ/26A8Q2', // hashed 'abc123'
    email: 'user@ellicottvilleskiclub.com',
    name: 'Regular User',
    position: 'Member',
    isApproved: true,
    isAdmin: false
  }
];

// Default auth state is null (no user logged in)
export const currentUser = null;
