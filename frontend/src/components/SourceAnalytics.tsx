'use client';

import { Box, Heading, SimpleGrid, Text, VStack, HStack } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { Stats } from '@/types/application';

interface SourceAnalyticsProps {
  stats: Stats;
}

export function SourceAnalytics({ stats }: SourceAnalyticsProps) {
  const { colorMode } = useColorMode();
  const topSources = stats.sourceCounts.slice(0, 6);

  const colors = ['emerald', 'blue', 'purple', 'orange', 'pink', 'teal'];

  // Color hex values for progress bars
  const colorHex: Record<string, string> = {
    emerald: '#10b981',  // emerald-500
    blue: '#3b82f6',     // blue-500
    purple: '#8b5cf6',   // purple-500
    orange: '#f97316',   // orange-500
    pink: '#ec4899',     // pink-500
    teal: '#14b8a6',     // teal-500
  };

  // Debug logging
  console.log('SourceAnalytics - stats.totalApplications:', stats.totalApplications);
  console.log('SourceAnalytics - topSources:', topSources);

  return (
    <Box
      p={{ base: 5, md: 7 }}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
      shadow="lg"
    >
      <VStack align="stretch" gap={{ base: 5, md: 6 }}>
        <Box>
          <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold" mb={1}>
            Top Application Sources
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            Where you&apos;re finding the most opportunities
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
          {topSources.map((source, index) => {
            const actualPercentage = stats.totalApplications > 0
              ? ((source.count / stats.totalApplications) * 100)
              : 0;
            const percentageText = actualPercentage.toFixed(1);
            const color = colors[index];

            // Ensure valid width value
            const barWidth = Math.min(Math.max(actualPercentage, 0), 100);

            // Debug first item
            if (index === 0) {
              console.log('First source:', source.source);
              console.log('  count:', source.count);
              console.log('  actualPercentage:', actualPercentage);
              console.log('  barWidth:', barWidth);
              console.log('  percentageText:', percentageText);
            }

            return (
              <Box
                key={source.source}
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                borderWidth="2px"
                borderColor={colorMode === 'light' ? `${color}.200` : 'gray.600'}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  borderColor: colorMode === 'light' ? `${color}.400` : 'gray.500',
                }}
              >
                <HStack justify="space-between" mb={3}>
                  <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} color={colorMode === 'light' ? 'gray.900' : 'white'}>
                    {source.source}
                  </Text>
                  <HStack gap={3}>
                    <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.800' : 'gray.300'} fontWeight="medium">
                      {source.count} apps
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={`${color}.600`}>
                      {percentageText}%
                    </Text>
                  </HStack>
                </HStack>
                <Box position="relative" h="10px" bg={colorMode === 'light' ? 'gray.200' : 'gray.600'} borderRadius="full" overflow="hidden">
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${barWidth}%`,
                      backgroundColor: colorHex[color],
                      borderRadius: '9999px',
                      transition: 'width 0.6s ease-out',
                      minWidth: barWidth > 0 ? '2px' : '0',
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
