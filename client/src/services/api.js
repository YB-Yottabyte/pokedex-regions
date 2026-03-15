import axios from 'axios';

const API_BASE_URL = '/api';

// Locations API
export const getLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/locations`);
  return response.data;
};

export const getLocationBySlug = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/locations/${slug}`);
  return response.data;
};

// Events API
export const getAllEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};

export const getEventsByLocationSlug = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/events/location-slug/${slug}`);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/events/${id}`);
  return response.data;
};
