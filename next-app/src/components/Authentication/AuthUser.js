import axios from "axios";

const AuthUser = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const saveToken = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const getToken = () => {
    const user = localStorage.getItem("user");
    return user ;
  };
  const isLogin = () => {
    const token = getToken();
    return token !== null;
  };

  const logout = () => {
    localStorage.removeItem("user");
  };

  const callApi = async (apiData) => {
    const { method, api, data } = apiData;
    const token = getToken();
    const defaultHeaders = {};
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      let response;
      switch (method) {
        case "GET":
          response = await axios.get(`${baseURL}${api}`, {
            headers: defaultHeaders,
          });
          break;
        case "POST":
          response = await axios.post(`${baseURL}${api}`, data, {
            headers: defaultHeaders,
          });
          break;
        case "UPLOAD":
          const imageDataToSend = new FormData();
          for (const key in data) {
            imageDataToSend.append(key, data[key]); // Append image data to FormData
          }
          response = await axios.post(`${baseURL}${api}`, imageDataToSend, {
            headers: defaultHeaders,
          });
          break;
        case "DELETE":
          response = await axios.delete(`${baseURL}${api}`, {
            headers: defaultHeaders,
          });
          break;
        default:
          throw new Error("Unsupported HTTP method");
      }

      return response.data; // Return the data from the API response
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error("API call failed");
    }
  };

  return {
    saveToken,
    callApi,
    getToken,
    isLogin,
    logout,
  };
};

export default AuthUser;
