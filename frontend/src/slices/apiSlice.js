import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { mockApiHandlers, handleEntityById } from "../mockData/mockApi";

import { logout } from "./authSlice"; // Import the logout action

// NOTE: This version uses mock data for portfolio purposes
// No actual backend calls are made

// Original base query (kept for reference)
const originalBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

// Mock base query that uses our mock data instead of real API calls
const mockBaseQuery = () => async (args) => {
  const { url, method = 'GET', body } = args;
  
  console.log(`Mock API call: ${method} ${url}`);
  
  // Extract the base URL and ID if present
  const urlParts = url.split('/');
  const id = urlParts[urlParts.length - 1];
  const baseUrl = urlParts.length > 3 && !isNaN(id) ? urlParts.slice(0, -1).join('/') : url;
  
  // Check if we have a specific handler for this URL
  if (mockApiHandlers[url]) {
    return mockApiHandlers[url](body);
  }
  
  // Check if this is an ID-based operation
  if (!isNaN(id) && id !== '') {
    return handleEntityById(baseUrl, id, method, body);
  }
  
  // For any other URLs, try the base URL with the method
  if (mockApiHandlers[baseUrl]) {
    return mockApiHandlers[baseUrl](method, body);
  }
  
  // For any unhandled URLs, return a 404
  console.warn(`Unhandled mock API call: ${method} ${url}`);
  return { error: { status: 404, data: { message: 'Not found' } } };
};

// Use the mock base query for the portfolio version
const baseQuery = mockBaseQuery();

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery
  tagTypes: ["Images", "Tags", "User", "Post", "News", "Units", "Events"],
  endpoints: (builder) => ({}),
});
