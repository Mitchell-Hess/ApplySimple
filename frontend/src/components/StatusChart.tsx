'use client';

import { Box, SimpleGrid, VStack, Text, HStack } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Application } from '@/types/application';

interface StatusChartProps {
  applications: Application[];
}

const COLORS = {
  Applied: '#93c5fd',    // blue-300 - soft pastel blue
  Screening: '#fcd34d',  // amber-300 - soft pastel yellow
  Interview: '#c4b5fd',  // purple-300 - soft pastel purple
  Offer: '#86efac',      // green-300 - soft pastel green
  Rejected: '#fca5a5',   // red-300 - soft pastel red
  Withdrawn: '#d1d5db',  // gray-300 - soft pastel gray
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} alignItems="start">
      {/* Pie Chart */}
      <Box
        p={4}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.300"
      >
        <ResponsiveContainer width="100%" height={400}>
          <PieChart margin={{ top: 15, right: 70, bottom: 15, left: 70 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={{
                stroke: '#9ca3af',
                strokeWidth: 1.5,
              }}
              label={(props: any) => {
                const RADIAN = Math.PI / 180;
                const { cx, cy, midAngle, outerRadius, name, percent, value } = props;
                const radius = outerRadius + 35;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <g>
                    <text
                      x={x}
                      y={y - 10}
                      fill="#1f2937"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontWeight="800"
                      fontSize="15"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      {name}
                    </text>
                    <text
                      x={x}
                      y={y + 10}
                      fill="#6b7280"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontWeight="600"
                      fontSize="13"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      {`${value} (${(percent * 100).toFixed(1)}%)`}
                    </text>
                  </g>
                );
              }}
              outerRadius={135}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={3}
              stroke="#fff"
              paddingAngle={1}
              minAngle={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px 14px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{
                color: '#1f2937',
                fontWeight: '600'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend with Stats */}
      <VStack align="stretch" gap={2}>
        {data.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <Box
              key={item.name}
              p={3}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              borderLeftWidth="3px"
              borderLeftColor={COLORS[item.name as keyof typeof COLORS]}
            >
              <HStack justify="space-between">
                <HStack gap={2}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={COLORS[item.name as keyof typeof COLORS]}
                  />
                  <Text fontWeight="semibold" color="gray.900" fontSize="sm">
                    {item.name}
                  </Text>
                </HStack>
                <HStack gap={3}>
                  <Text fontSize="xs" color="gray.600">
                    {item.value} apps
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="gray.900">
                    {percentage}%
                  </Text>
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </SimpleGrid>
  );
}
