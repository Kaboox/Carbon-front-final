export interface DailyCarbonProfile {
    date: string;
    cleanEnergyPercent: number;
    fuelMix: Record<string, number>;
}

export interface ChargingWindow {
    startTime: string;
    endTime: string;
    cleanEnergyPercent: number;
}