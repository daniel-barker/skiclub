// Sample user data
export const users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
    unit: '101',
    phone: '555-123-4567',
    username: 'admin'
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    isAdmin: false,
    unit: '102',
    phone: '555-234-5678',
    username: 'johndoe'
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    isAdmin: false,
    unit: '103',
    phone: '555-345-6789',
    username: 'janesmith'
  }
];

// Current user for auth state
export const currentUser = {
  _id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  isAdmin: true,
  unit: '101',
  phone: '555-123-4567',
  username: 'admin'
};
