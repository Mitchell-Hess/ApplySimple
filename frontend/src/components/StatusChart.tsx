'use client';

import { Box, Heading } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Application } from '@/types/application';

interface StatusChartProps {
  applications: Application[];
}

const COLORS = {
  Applied: '#3182CE',
  Screening: '#ECC94B',
  Interview: '#805AD5',
  Offer: '#38A169',
  Rejected: '#E53E3E',
  Withdrawn: '#A0AEC0',
};

export function StatusChart({ applications }: StatusChartProps) {
  // Count applications by status
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <Box p={8} textAlign="center" color="gray.500">
        No data to display
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Applications by Status</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, percent } = props;
              return `${name} ${((percent || 0) * 100).toFixed(0)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
