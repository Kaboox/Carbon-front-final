import axios from "axios";
import type { ChargingWindow, DailyCarbonProfile } from "./types";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/carbon',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchDailyMix = async (): Promise<DailyCarbonProfile[]> => {
    const response = await apiClient.get<DailyCarbonProfile[]>('/mix');
    return response.data;
};

export const fetchOptimalCharging = async (hours: number): Promise<ChargingWindow> => {
    const response = await apiClient.get<ChargingWindow>(`/optimal-charging?hours=${hours}`);
    return response.data;
};