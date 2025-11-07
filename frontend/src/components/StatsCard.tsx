'use client';

import { Box, Text, Stat } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

const colorConfig = {
  mint: {
    bg: '#ecfdf5',        // emerald.50
    border: '#a7f3d0',    // emerald.200
    accent: '#10b981',    // emerald.500
    iconBg: '#d1fae5',    // emerald.100
    iconColor: '#059669',  // emerald.600
  },
  peach: {
    bg: 'orange.50',
    border: 'orange.200',
    accent: 'orange.500',
    iconBg: 'orange.100',
    iconColor: 'orange.600',
  },
  lavender: {
    bg: 'purple.50',
    border: 'purple.200',
    accent: 'purple.500',
    iconBg: 'purple.100',
    iconColor: 'purple.600',
  },
  sky: {
    bg: 'blue.50',
    border: 'blue.200',
    accent: 'blue.500',
    iconBg: 'blue.100',
    iconColor: 'blue.600',
  },
};

export function StatsCard({ label, value, icon, color = 'mint', subtitle }: StatsCardProps) {
  const { colorMode } = useColorMode();
  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.mint;

  return (
    <Box
      p={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderWidth="2px"
      borderColor={colorMode === 'light' ? config.border : 'gray.600'}
      shadow="lg"
      transition="all 0.3s ease"
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        borderColor: colorMode === 'light' ? config.accent : 'gray.500',
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        bg: config.accent,
      }}
    >
      <Stat.Root>
        {icon && (
          <Box
            display="inline-flex"
            p={3}
            borderRadius="xl"
            bg={config.iconBg}
            fontSize={{ base: "2xl", md: "3xl" }}
            color={config.iconColor}
            mb={4}
          >
            {icon}
          </Box>
        )}
        <Stat.Label
          fontSize={{ base: "xs", md: "sm" }}
          color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
          fontWeight="semibold"
          mb={2}
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {label}
        </Stat.Label>
        <Stat.ValueText
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          color={colorMode === 'light' ? 'gray.900' : 'white'}
          mb={2}
        >
          {value}
        </Stat.ValueText>
        {subtitle && (
          <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.700' : 'gray.300'} fontWeight="medium">
            {subtitle}
          </Text>
        )}
      </Stat.Root>
    </Box>
  );
}
