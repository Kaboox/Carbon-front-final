import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import type { DailyCarbonProfile } from '../types';


interface Props {
    data: DailyCarbonProfile;
    label: string;
}


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6384'];

export const DailyMixChart: React.FC<Props> = ({ data, label }) => {
    
    
    const chartData = Object.entries(data.fuelMix)
        .map(([key, value]) => ({
            name: key,
            value: value
        }))
        .filter(item => item.value > 0);

    return (
        <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '12px', 
            padding: '20px', 
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '350px'
        }}>
            
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{label}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '0.9rem' }}>
                {format(new Date(data.date), 'dd.MM.yyyy')}
            </p>
            
            <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            
            <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '6px',
                color: '#166534',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Clean energy: {data.cleanEnergyPercent.toFixed(1)}%
            </div>
        </div>
    );
};