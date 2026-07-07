"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { State, City, IState, ICity } from "country-state-city";
import axios from "axios";
import {
  getCitiesForState,
  getAllStates,
  getDistrictForState,
} from "@/actions/extras/states-cities";

interface GeoStoreInterface {
  states: string[];
  cities: string[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  getCities: (stateCode: string) => Promise<string[]>;
  getDistrict: (stateCode: string) => Promise<string[]>;
  clearCities: () => void;
}

const GeoStoreContext = createContext<GeoStoreInterface | null>(null);

interface GeoStoreProps {
  children: React.ReactNode;
  countryCode: string;
}

export function GeoStore({ children, countryCode }: GeoStoreProps) {
  const [cities, setCities] = useState<string[]>([]);

  const statesQuery = useQuery({
    queryKey: ["geo", "states", countryCode],
    queryFn: async () => {
      const res = await getAllStates();
      return res.states;
      // return [
      //   // {
      //   //   name: "Other",
      //   //   isoCode: "OTHER",
      //   //   countryCode,
      //   //   latitude: "",
      //   //   longitude: "",
      //   // },
      // ];
    },
    enabled: !!countryCode,
    staleTime: Infinity,
  });

  const getCities = useCallback(async (state: string): Promise<string[]> => {
    if (!state) {
      setCities([]);
      return [];
    }
    try {
      const response = await getCitiesForState(state);
      const result = response.cities || [];

      setCities(result);

      return result;
    } catch (err) {
      console.error("[GET CITIES ERROR]", err);
      setCities([]);
      return [];
    }
  }, []);

  const getDistrict = useCallback(async (state: string): Promise<string[]> => {
    if (!state) {
      setCities([]);
      return [];
    }
    try {
      const response = await getDistrictForState(state);
      const result = response.district || [];

      return result;
    } catch (err) {
      console.error("[GET DISTRICT ERROR]", err);
      setCities([]);
      return [];
    }
  }, []);

  const clearCities = useCallback(() => {
    setCities([]);
  }, []);

  return (
    <GeoStoreContext.Provider
      value={{
        states: statesQuery.data ?? [],
        cities,
        isLoading: statesQuery.isLoading,
        isFetching: statesQuery.isFetching,
        isError: statesQuery.isError,
        error: (statesQuery.error as Error) || null,
        getCities,
        getDistrict,
        clearCities,
      }}
    >
      {children}
    </GeoStoreContext.Provider>
  );
}

export function useGeoStore() {
  const ctx = useContext(GeoStoreContext);

  if (!ctx) {
    throw new Error("useGeoStore must be used inside GeoStore");
  }

  return ctx;
}
