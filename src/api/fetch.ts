import axios, { AxiosRequestConfig } from "axios";
import { HttpCallOptions } from "../types";

const httpCall = async ({
  url,
  method = "POST",
  data = {},
}: HttpCallOptions): Promise<any> => {
  try {
    const axiosConfig: AxiosRequestConfig = {
      method, // GET, POST, PUT, DELETE, etc.
      url,
      headers: {
        "Content-Type": "application/json", // You can adjust the content type based on your needs
      },
      ...(method !== "GET" && { data }), // Include data for non-GET requests
    };

    const response = await axios(axiosConfig);

    return response.data;
  } catch (error) {
    // Handle errors here
    console.error("HTTP call error:", error);
    throw error;
  }
};

export default httpCall;
