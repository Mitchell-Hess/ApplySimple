'use client';

import { Box, Heading, SimpleGrid, Text, VStack, HStack, Badge, Progress } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { Application, PredictionResponse } from '@/types/application';
import { FiTrendingUp, FiActivity, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useMemo } from 'react';

interface MLInsightsProps {
  applications: Application[];
  predictions?: Map<string, PredictionResponse>;
}

export function MLInsights({ predictions }: MLInsightsProps) {
  const { colorMode } = useColorMode();

  // Calculate aggregate insights from predictions
  const insights = useMemo(() => {
    if (!predictions || predictions.size === 0) {
      return null;
    }

    const predictionArray = Array.from(predictions.values());
    const avgSuccessProbability = predictionArray.reduce((sum, p) => sum + p.success_probability, 0) / predictionArray.length;
    const avgConfidence = predictionArray.reduce((sum, p) => sum + p.confidence, 0) / predictionArray.length;

    // Count high probability applications (>= 0.6)
    const highProbabilityCount = predictionArray.filter(p => p.success_probability >= 0.6).length;

    // Extract top factors across all predictions
    const factorFrequency: Record<string, number> = {};
    predictionArray.forEach(p => {
      Object.keys(p.factors).forEach(factor => {
        factorFrequency[factor] = (factorFrequency[factor] || 0) + 1;
      });
    });

    const topFactors = Object.entries(factorFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([factor]) => factor);

    return {
      avgSuccessProbability,
      avgConfidence,
      highProbabilityCount,
      totalPredictions: predictionArray.length,
      topFactors,
    };
  }, [predictions]);

  if (!insights) {
    return (
      <Box
        p={{ base: 5, md: 7 }}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
        shadow="lg"
      >
        <VStack align="center" gap={3} py={8}>
          <FiActivity size={48} color={colorMode === 'light' ? '#9ca3af' : '#6b7280'} />
          <Text fontSize={{ base: "md", md: "lg" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} fontWeight="medium">
            No ML predictions available yet
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.500' : 'gray.500'} textAlign="center">
            Predictions will be generated for your applications automatically
          </Text>
        </VStack>
      </Box>
    );
  }

  const getSuccessColor = (probability: number) => {
    if (probability >= 0.7) return 'green';
    if (probability >= 0.5) return 'blue';
    if (probability >= 0.3) return 'orange';
    return 'red';
  };

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
        {/* Header */}
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
          <Box>
            <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold" mb={1}>
              ML Insights & Predictions
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              AI-powered analysis of your application success patterns
            </Text>
          </Box>
          <Badge
            px={{ base: 3, md: 4 }}
            py={2}
            borderRadius="lg"
            bg="purple.600"
            color="white"
            fontWeight="semibold"
            fontSize={{ base: "xs", md: "sm" }}
          >
            <HStack gap={2}>
              <FiActivity />
              <Text>{insights.totalPredictions} Analyzed</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* Insights Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 4, md: 5 }}>
          {/* Average Success Rate */}
          <Box
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderWidth="2px"
            borderColor={colorMode === 'light' ? `${getSuccessColor(insights.avgSuccessProbability)}.200` : 'gray.600'}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
              borderColor: colorMode === 'light' ? `${getSuccessColor(insights.avgSuccessProbability)}.400` : 'gray.500',
            }}
          >
            <VStack align="start" gap={3}>
              <HStack justify="space-between" w="100%">
                <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} fontWeight="semibold" textTransform="uppercase">
                  Avg Success Rate
                </Text>
                <FiTrendingUp color={`var(--chakra-colors-${getSuccessColor(insights.avgSuccessProbability)}-500)`} />
              </HStack>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={`${getSuccessColor(insights.avgSuccessProbability)}.600`}>
                {(insights.avgSuccessProbability * 100).toFixed(1)}%
              </Text>
              <Progress.Root
                value={insights.avgSuccessProbability * 100}
                size="xs"
                w="100%"
                colorPalette={getSuccessColor(insights.avgSuccessProbability)}
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </VStack>
          </Box>

          {/* Model Confidence */}
          <Box
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'indigo.200' : 'gray.600'}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
              borderColor: colorMode === 'light' ? 'indigo.400' : 'gray.500',
            }}
          >
            <VStack align="start" gap={3}>
              <HStack justify="space-between" w="100%">
                <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} fontWeight="semibold" textTransform="uppercase">
                  Model Confidence
                </Text>
                <FiCheckCircle color="var(--chakra-colors-indigo-500)" />
              </HStack>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="indigo.600">
                {(insights.avgConfidence * 100).toFixed(1)}%
              </Text>
              <Progress.Root
                value={insights.avgConfidence * 100}
                size="xs"
                w="100%"
                colorPalette="indigo"
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </VStack>
          </Box>

          {/* High Probability Count */}
          <Box
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'emerald.200' : 'gray.600'}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
              borderColor: colorMode === 'light' ? 'emerald.400' : 'gray.500',
            }}
          >
            <VStack align="start" gap={3}>
              <HStack justify="space-between" w="100%">
                <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} fontWeight="semibold" textTransform="uppercase">
                  Strong Prospects
                </Text>
                <FiAlertCircle color="var(--chakra-colors-emerald-500)" />
              </HStack>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="emerald.600">
                {insights.highProbabilityCount}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Applications with &gt;60% success rate
              </Text>
            </VStack>
          </Box>

          {/* Success Rate Distribution */}
          <Box
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'purple.200' : 'gray.600'}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
              borderColor: colorMode === 'light' ? 'purple.400' : 'gray.500',
            }}
          >
            <VStack align="start" gap={3}>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} fontWeight="semibold" textTransform="uppercase">
                Opportunity Rate
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="purple.600">
                {((insights.highProbabilityCount / insights.totalPredictions) * 100).toFixed(0)}%
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                of applications are strong candidates
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Top Factors */}
        {insights.topFactors.length > 0 && (
          <Box
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            borderWidth="1px"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
          >
            <VStack align="start" gap={3}>
              <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.700' : 'gray.300'} fontWeight="semibold">
                Key Success Factors
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {insights.topFactors.map((factor, index) => (
                  <Badge
                    key={factor}
                    px={3}
                    py={1}
                    borderRadius="md"
                    bg={
                      factor === 'workType' ? 'gray.700' :
                      index === 0 ? 'blue.600' :
                      index === 1 ? 'purple.600' :
                      'indigo.600'
                    }
                    color="white"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {factor}
                  </Badge>
                ))}
              </HStack>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                These factors appear most frequently in your application predictions
              </Text>
            </VStack>
          </Box>
        )}

        {/* ML Accuracy Note */}
        <Box
          p={{ base: 3, md: 4 }}
          borderRadius="lg"
          bg={colorMode === 'light' ? 'blue.50' : 'gray.700'}
          borderWidth="1px"
          borderColor={colorMode === 'light' ? 'blue.200' : 'gray.600'}
        >
          <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'blue.800' : 'blue.300'} fontWeight="medium">
            💡 <strong>Note:</strong> ML predictions become more accurate as you add more applications with diverse outcomes (interviews, offers, rejections). The model learns from patterns in your data to provide better insights over time.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
