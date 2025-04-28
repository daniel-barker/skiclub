import { users, currentUser, news, events, units, images, posts } from './index';

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response
const mockResponse = async (data, error = null, status = 200) => {
  // Simulate network delay
  await delay(300);
  
  if (error) {
    return { error };
  }
  
  return { data, status };
};

// Mock API handlers
export const mockApiHandlers = {
  // User endpoints
  '/api/users/auth': async (data) => {
    const { username, password } = data;
    if (username && password) {
      return mockResponse(currentUser);
    }
    return mockResponse(null, { message: 'Invalid credentials' }, 401);
  },
  
  '/api/users': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(users);
    }
    if (method === 'POST') {
      // Simulate user registration
      return mockResponse({ ...data, _id: Date.now().toString() });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
  
  '/api/users/profile': async (data) => {
    // Simulate profile update
    return mockResponse({ ...currentUser, ...data });
  },
  
  '/api/users/logout': async () => {
    return mockResponse({ message: 'Logged out successfully' });
  },
  
  '/api/users/forgot-username': async (data) => {
    return mockResponse({ message: 'If your email is registered, you will receive your username shortly.' });
  },
  
  '/api/users/forgot-password': async (data) => {
    return mockResponse({ message: 'If your email is registered, you will receive a password reset link shortly.' });
  },
  
  // News endpoints
  '/api/news/all': async () => {
    return mockResponse(news);
  },
  
  '/api/news': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(news.filter(item => item.isPublished));
    }
    if (method === 'POST') {
      // Simulate news creation
      return mockResponse({ ...data, _id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
  
  '/api/news/latest': async () => {
    return mockResponse(news.filter(item => item.isPublished).slice(0, 3));
  },
  
  '/api/news/upload-image': async (data) => {
    return mockResponse({ url: '/images/placeholder.jpg' });
  },
  
  '/api/news/upload-pdf': async (data) => {
    return mockResponse({ url: '/pdfs/placeholder.pdf' });
  },
  
  // Events endpoints
  '/api/events': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(events);
    }
    if (method === 'POST') {
      // Simulate event creation
      return mockResponse({ ...data, _id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
  
  // Units endpoints
  '/api/unit': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(units);
    }
    if (method === 'POST') {
      // Simulate unit creation
      return mockResponse({ ...data, _id: Date.now().toString() });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
  
  // Images endpoints
  '/api/images': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(images);
    }
    if (method === 'POST') {
      // Simulate image upload
      return mockResponse({ ...data, _id: Date.now().toString(), url: '/images/placeholder.jpg' });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
  
  // Posts endpoints
  '/api/posts': async (method, data) => {
    if (method === 'GET') {
      return mockResponse(posts);
    }
    if (method === 'POST') {
      // Simulate post creation
      return mockResponse({ ...data, _id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    return mockResponse(null, { message: 'Method not supported' }, 405);
  },
};

// Generic handler for ID-based operations
export const handleEntityById = async (baseUrl, id, method = 'GET', data = null) => {
  const entities = {
    '/api/users': users,
    '/api/news': news,
    '/api/events': events,
    '/api/unit': units,
    '/api/images': images,
    '/api/posts': posts,
  };
  
  const entityList = entities[baseUrl];
  if (!entityList) {
    return mockResponse(null, { message: 'Entity not found' }, 404);
  }
  
  const entity = entityList.find(e => e._id === id);
  
  if (!entity) {
    return mockResponse(null, { message: 'Item not found' }, 404);
  }
  
  if (method === 'GET') {
    return mockResponse(entity);
  }
  
  if (method === 'PUT') {
    return mockResponse({ ...entity, ...data, updatedAt: new Date().toISOString() });
  }
  
  if (method === 'DELETE') {
    return mockResponse({ success: true, message: 'Item deleted successfully' });
  }
  
  return mockResponse(null, { message: 'Method not supported' }, 405);
};
