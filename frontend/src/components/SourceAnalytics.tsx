'use client';

import { Box, Heading, SimpleGrid, Text, VStack, HStack } from '@chakra-ui/react';
import { Stats } from '@/types/application';

interface SourceAnalyticsProps {
  stats: Stats;
}

export function SourceAnalytics({ stats }: SourceAnalyticsProps) {
  const topSources = stats.sourceCounts.slice(0, 6);
  const maxCount = Math.max(...topSources.map(s => s.count), 1);

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
      bg="white"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="indigo.100"
      shadow="lg"
    >
      <VStack align="stretch" gap={{ base: 5, md: 6 }}>
        <Box>
          <Heading size={{ base: "lg", md: "xl" }} color="gray.900" fontWeight="bold" mb={1}>
            Top Application Sources
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
            Where you're finding the most opportunities
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
                bg="white"
                borderWidth="2px"
                borderColor={`${color}.200`}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  borderColor: `${color}.400`,
                }}
              >
                <HStack justify="space-between" mb={3}>
                  <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} color="gray.900">
                    {source.source}
                  </Text>
                  <HStack gap={3}>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.800" fontWeight="medium">
                      {source.count} apps
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={`${color}.600`}>
                      {percentageText}%
                    </Text>
                  </HStack>
                </HStack>
                <Box position="relative" h="10px" bg="gray.200" borderRadius="full" overflow="hidden">
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
