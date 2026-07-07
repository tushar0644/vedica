"use server";
import axios from "axios";
const BASE_URL = process.env.BACKEND_URL!;
export const getCitiesForState = async (state: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/method/get_cities_for_state`,
      {
        params: {
          state,
        },
      },
    );

    // console.log(response.data);
    return {
      success: true,
      message: "City for states",
      cities: response.data.message,
    };
  } catch (err: any) {
    console.error("[ADDRESS][CITY][ERROR]", err.response.data);
    return {
      success: false,
      message: "Failed to get state list",
    };
  }
};
export const getDistrictForState = async (state: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/method/get_state_for_dist_city`,
      {
        params: {
          state,
        },
      },
    );
    // console.log(response.data.message.districts.map((ele: any) => ele.name));
    return {
      success: true,
      message: "District for states",
      district: response.data.message.districts.map((ele: any) => ele.name),
    };
  } catch (err: any) {
    console.error("[ADDRESS][DISTRICT][ERROR]", err.response.data);
    return {
      success: false,
      message: "Failed to get city list",
    };
  }
};

export const getAllCities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/method/get-allcity`, {});
    // console.log("[GET ALL CITIES]", response.data.message);
    return {
      success: true,
      message: "All Cities",
      cities: response.data.message.map((ele: any) => ele.name),
    };
  } catch (err: any) {
    console.error("[ADDRESS][DISTRICT][ERROR]", err.response.data);
    return {
      success: false,
      message: "Failed to get city list",
    };
  }
};

export const getAllStates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/method/all_state`, {});
    // console.log("[GET ALL CITIES]", response.data.message);
    return {
      success: true,
      message: "All States",
      states: response.data.message.map((ele: any) => ele.name),
    };
  } catch (err: any) {
    console.error("[ADDRESS][STATE][ERROR]", err.response.data);
    return {
      success: false,
      message: "Failed to get state list",
    };
  }
};
