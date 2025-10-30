'use client';

import { Box, Text, Stat } from '@chakra-ui/react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

const colorConfig = {
  mint: {
    bg: 'green.50',
    border: 'green.200',
    text: 'green.700',
    value: 'gray.900',
  },
  peach: {
    bg: 'orange.50',
    border: 'orange.200',
    text: 'orange.700',
    value: 'gray.900',
  },
  lavender: {
    bg: 'purple.50',
    border: 'purple.200',
    text: 'purple.700',
    value: 'gray.900',
  },
  sky: {
    bg: 'blue.50',
    border: 'blue.200',
    text: 'blue.700',
    value: 'gray.900',
  },
};

export function StatsCard({ label, value, icon, color = 'mint', subtitle }: StatsCardProps) {
  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.mint;

  return (
    <Box
      p={6}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={config.border}
      bg={config.bg}
      shadow="sm"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
    >
      <Stat.Root>
        {icon && (
          <Box fontSize="2xl" color={config.text} mb={2}>
            {icon}
          </Box>
        )}
        <Stat.Label
          fontSize="xs"
          color={config.text}
          fontWeight="semibold"
          mb={2}
        >
          {label}
        </Stat.Label>
        <Stat.ValueText
          fontSize="3xl"
          fontWeight="bold"
          color={config.value}
          mb={1}
        >
          {value}
        </Stat.ValueText>
        {subtitle && (
          <Text fontSize="sm" color="gray.600">
            {subtitle}
          </Text>
        )}
      </Stat.Root>
    </Box>
  );
}
