import axiosInstance from "../axios.instance";

// Registers a new user by sending their details to the `/register` endpoint
export const Signup = async (data) => {
  console.log('Signup data:', data);  // Add this line to log the signup data
  try {
    const response = await axiosInstance.post(`/register`, data); // Ensure the trailing slash is consistent
    console.log('Signup response:', response);  // Add this line to log the response
    return response;
  } catch (error) {
    console.error('Signup error:', error.response ? error.response.data : error.message);  // Log more detailed error info
    throw error;
  }
};

// Authenticates an existing user by sending their credentials to the `/login` endpoint
export const Login = async (data) => {
  try {
    const response = await axiosInstance.post(`/login`, data); // Ensure the trailing slash is consistent
    return response;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);  // Log more detailed error info
    throw error;
  }
};

// Accesses a protected resource by sending a GET request to the `/protected` endpoint
export const Protected = async () => {
  try {
    const response = await axiosInstance.get(`/protected`); // Ensure the trailing slash is consistent
    return response;
  } catch (error) {
    console.error('Protected resource error:', error.response ? error.response.data : error.message);  // Log more detailed error info
    throw error;
  }
};

// Authenticates an existing user by sending their credentials to the `/login` endpoint

