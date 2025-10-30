'use client';

import { Box, Text, Stat } from '@chakra-ui/react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export function StatsCard({ label, value, icon, color = 'teal' }: StatsCardProps) {
  return (
    <Box
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
    >
      <Stat.Root>
        {icon && (
          <Box fontSize="2xl" color={`${color}.500`} mb={2}>
            {icon}
          </Box>
        )}
        <Stat.Label fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
          {label}
        </Stat.Label>
        <Stat.ValueText fontSize="3xl" fontWeight="bold" color={`${color}.600`}>
          {value}
        </Stat.ValueText>
      </Stat.Root>
    </Box>
  );
}
