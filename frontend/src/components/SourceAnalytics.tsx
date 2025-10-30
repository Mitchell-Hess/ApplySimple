'use client';

import { Box, Heading, SimpleGrid, Text, VStack, HStack } from '@chakra-ui/react';
import { Stats } from '@/types/application';

interface SourceAnalyticsProps {
  stats: Stats;
}

export function SourceAnalytics({ stats }: SourceAnalyticsProps) {
  const topSources = stats.sourceCounts.slice(0, 6);
  const maxCount = topSources[0]?.count || 1;

  const colors = ['green', 'orange', 'purple', 'blue', 'pink', 'teal'];

  return (
    <Box
      p={8}
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      shadow="sm"
    >
      <VStack align="stretch" gap={6}>
        <Heading size="lg" color="gray.900">Top Application Sources</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {topSources.map((source, index) => {
            const percentage = ((source.count / stats.totalApplications) * 100);
            const percentageText = percentage.toFixed(1);
            const color = colors[index];

            return (
              <Box key={source.source}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.900">
                    {source.source}
                  </Text>
                  <HStack gap={2}>
                    <Text fontSize="sm" color="gray.600">
                      {source.count} apps
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color={`${color}.600`}>
                      {percentageText}%
                    </Text>
                  </HStack>
                </HStack>
                <Box position="relative" h="8px" bg="gray.100" borderRadius="full" overflow="hidden">
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    w={`${percentage}%`}
                    bg={`${color}.400`}
                    borderRadius="full"
                    transition="width 0.5s ease-out"
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
