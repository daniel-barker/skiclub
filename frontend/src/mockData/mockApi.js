import { users, currentUser, news, events, units, images, posts } from './index';

// Mock carousel images for the member page
const carouselImages = [
  {
    _id: '1',
    title: 'Winter Landscape',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200',
    tags: ['winter', 'landscape']
  },
  {
    _id: '2',
    title: 'Ski Resort',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200',
    tags: ['resort', 'mountain']
  },
  {
    _id: '3',
    title: 'Snowy Mountains',
    image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1200',
    tags: ['mountain', 'snow']
  }
];

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
    // Return 3 mock news items with proper structure for the LatestNews component
    const latestNews = [
      {
        _id: '1',
        title: 'Winter Season Opening',
        post: '<p>The ski club will open for the winter season on December 1st. Get your gear ready!</p>',
        createdAt: '2025-03-15T12:00:00Z',
        updatedAt: '2025-03-15T12:00:00Z',
        isPublished: true,
        image: '/images/winter-opening.jpg',
        thumbnail: '/images/winter-opening.jpg'
      },
      {
        _id: '2',
        title: 'New Chairlift Installation',
        post: '<p>We are excited to announce the installation of a new high-speed chairlift for the upcoming season.</p>',
        createdAt: '2025-02-20T14:30:00Z',
        updatedAt: '2025-02-21T09:15:00Z',
        isPublished: true,
        image: '/images/new-chairlift.jpg',
        thumbnail: '/images/new-chairlift.jpg'
      },
      {
        _id: '3',
        title: 'Annual Member Meeting',
        post: '<p>The annual member meeting will be held on May 15th at the lodge. All members are encouraged to attend.</p>',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
        isPublished: true
      }
    ];
    return mockResponse(latestNews);
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
  
  '/api/images/carousel': async () => {
    // Return carousel images for the member page
    return mockResponse(carouselImages);
  },
  
  '/api/images/tags': async () => {
    // Return unique tags from all images
    const allTags = images.reduce((tags, img) => {
      if (img.tags && Array.isArray(img.tags)) {
        return [...tags, ...img.tags];
      }
      return tags;
    }, []);
    const uniqueTags = [...new Set(allTags)];
    return mockResponse(uniqueTags);
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
  
  '/api/posts/latest': async () => {
    // Return 3 mock posts with proper structure for the LatestPosts component
    const latestPosts = [
      {
        _id: '1',
        title: 'Looking for ski partners this weekend',
        body: '<p>Anyone planning to ski this weekend? Looking for company on the slopes!</p>',
        createdAt: '2025-03-20T14:30:00Z',
        user: {
          _id: '67f6c0b05a8f631d3bc66a37',
          name: 'Regular User'
        },
        isApproved: true
      },
      {
        _id: '2',
        title: 'Selling ski equipment',
        body: '<p>I have some lightly used ski equipment for sale. DM me if interested.</p>',
        createdAt: '2025-03-15T10:15:00Z',
        user: {
          _id: '67f6c0b05a8f631d3bc66a36',
          name: 'Admin User'
        },
        isApproved: true
      },
      {
        _id: '3',
        title: 'Potluck dinner this Friday',
        body: '<p>Hosting a potluck dinner at the lodge this Friday at 7pm. Everyone welcome!</p>',
        createdAt: '2025-03-10T09:45:00Z',
        user: {
          _id: '67f6c0b05a8f631d3bc66a37',
          name: 'Regular User'
        },
        isApproved: true
      }
    ];
    return mockResponse(latestPosts);
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
