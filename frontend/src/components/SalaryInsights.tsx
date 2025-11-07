'use client';

import { useMemo } from 'react';
import { Box, Heading, SimpleGrid, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { Application } from '@/types/application';
import { parseSalary } from '@/lib/normalize';

interface SalaryInsightsProps {
  applications: Application[];
}

export function SalaryInsights({ applications }: SalaryInsightsProps) {
  const { colorMode } = useColorMode();

  const salaryData = useMemo(() => {
    // Parse all salaries
    const salaries = applications
      .map(app => parseSalary(app.salary))
      .filter(s => s.min !== null && s.max !== null);

    if (salaries.length === 0) {
      return null;
    }

    // Calculate statistics using midpoint of ranges
    const midpoints = salaries.map(s => ((s.min || 0) + (s.max || 0)) / 2);
    const allMins = salaries.map(s => s.min || 0);
    const allMaxs = salaries.map(s => s.max || 0);

    const avgSalary = midpoints.reduce((a, b) => a + b, 0) / midpoints.length;
    const minSalary = Math.min(...allMins);
    const maxSalary = Math.max(...allMaxs);

    // Calculate median
    const sortedMidpoints = [...midpoints].sort((a, b) => a - b);
    const median = sortedMidpoints.length % 2 === 0
      ? (sortedMidpoints[sortedMidpoints.length / 2 - 1] + sortedMidpoints[sortedMidpoints.length / 2]) / 2
      : sortedMidpoints[Math.floor(sortedMidpoints.length / 2)];

    // Distribution by range
    const under100k = salaries.filter(s => (s.max || 0) < 100).length;
    const range100to150k = salaries.filter(s => (s.min || 0) >= 100 && (s.max || 0) <= 150).length;
    const range150to200k = salaries.filter(s => (s.min || 0) >= 150 && (s.max || 0) <= 200).length;
    const over200k = salaries.filter(s => (s.min || 0) > 200).length;

    // Salary by job type
    const byJobType: Record<string, number[]> = {};
    applications.forEach(app => {
      const salary = parseSalary(app.salary);
      if (salary.min !== null && salary.max !== null && app.jobType) {
        if (!byJobType[app.jobType]) {
          byJobType[app.jobType] = [];
        }
        byJobType[app.jobType].push(((salary.min || 0) + (salary.max || 0)) / 2);
      }
    });

    const jobTypeAverages = Object.entries(byJobType).map(([type, salaries]) => ({
      type,
      avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      count: salaries.length,
    })).sort((a, b) => b.avg - a.avg);

    return {
      avgSalary,
      minSalary,
      maxSalary,
      median,
      totalWithSalary: salaries.length,
      distribution: {
        under100k,
        range100to150k,
        range150to200k,
        over200k,
      },
      jobTypeAverages,
    };
  }, [applications]);

  if (!salaryData) {
    return (
      <Box
        p={{ base: 6, md: 8 }}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
        shadow="lg"
      >
        <VStack align="start" gap={2}>
          <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold">
            Salary Insights
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            No salary data available yet. Add salary information to your applications to see insights.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      p={{ base: 6, md: 8 }}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
      shadow="lg"
    >
      <VStack align="stretch" gap={{ base: 5, md: 6 }}>
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1}>
            <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold">
              Salary Insights
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              Compensation analysis across your applications
            </Text>
          </VStack>
          <Badge
            px={{ base: 4, md: 5 }}
            py={2}
            borderRadius="lg"
            bg="green.600"
            color="white"
            fontWeight="semibold"
            fontSize={{ base: "sm", md: "md" }}
          >
            {salaryData.totalWithSalary} with salary data
          </Badge>
        </HStack>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 4, md: 5 }}>
          <Box
            p={{ base: 4, md: 5 }}
            bg={colorMode === 'light' ? 'blue.50' : 'gray.700'}
            borderRadius="xl"
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'blue.200' : 'blue.800'}
          >
            <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'blue.600' : 'blue.300'} mb={1} fontWeight="semibold">
              Average Salary
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'blue.700' : 'blue.400'}>
              ${Math.round(salaryData.avgSalary)}k
            </Text>
          </Box>

          <Box
            p={{ base: 4, md: 5 }}
            bg={colorMode === 'light' ? 'green.50' : 'gray.700'}
            borderRadius="xl"
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'green.200' : 'green.800'}
          >
            <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'green.600' : 'green.300'} mb={1} fontWeight="semibold">
              Median Salary
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'green.700' : 'green.400'}>
              ${Math.round(salaryData.median)}k
            </Text>
          </Box>

          <Box
            p={{ base: 4, md: 5 }}
            bg={colorMode === 'light' ? 'purple.50' : 'gray.700'}
            borderRadius="xl"
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'purple.200' : 'purple.800'}
          >
            <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'purple.600' : 'purple.300'} mb={1} fontWeight="semibold">
              Minimum
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'purple.700' : 'purple.400'}>
              ${Math.round(salaryData.minSalary)}k
            </Text>
          </Box>

          <Box
            p={{ base: 4, md: 5 }}
            bg={colorMode === 'light' ? 'orange.50' : 'gray.700'}
            borderRadius="xl"
            borderWidth="2px"
            borderColor={colorMode === 'light' ? 'orange.200' : 'orange.800'}
          >
            <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'orange.600' : 'orange.300'} mb={1} fontWeight="semibold">
              Maximum
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'orange.700' : 'orange.400'}>
              ${Math.round(salaryData.maxSalary)}k
            </Text>
          </Box>
        </SimpleGrid>

        {/* Salary Distribution */}
        <Box>
          <Heading size={{ base: "md", md: "lg" }} mb={3} color={colorMode === 'light' ? 'gray.900' : 'white'}>
            Salary Distribution
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 3, md: 4 }}>
            <Box
              p={{ base: 3, md: 4 }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              borderRadius="lg"
              textAlign="center"
            >
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'gray.900' : 'white'}>
                {salaryData.distribution.under100k}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Under $100k
              </Text>
            </Box>
            <Box
              p={{ base: 3, md: 4 }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              borderRadius="lg"
              textAlign="center"
            >
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'gray.900' : 'white'}>
                {salaryData.distribution.range100to150k}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                $100k - $150k
              </Text>
            </Box>
            <Box
              p={{ base: 3, md: 4 }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              borderRadius="lg"
              textAlign="center"
            >
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'gray.900' : 'white'}>
                {salaryData.distribution.range150to200k}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                $150k - $200k
              </Text>
            </Box>
            <Box
              p={{ base: 3, md: 4 }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              borderRadius="lg"
              textAlign="center"
            >
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color={colorMode === 'light' ? 'gray.900' : 'white'}>
                {salaryData.distribution.over200k}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Over $200k
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Salary by Job Type */}
        {salaryData.jobTypeAverages.length > 0 && (
          <Box>
            <Heading size={{ base: "md", md: "lg" }} mb={3} color={colorMode === 'light' ? 'gray.900' : 'white'}>
              Average Salary by Job Type
            </Heading>
            <VStack align="stretch" gap={3}>
              {salaryData.jobTypeAverages.map((item, index) => (
                <Box
                  key={item.type}
                  p={{ base: 3, md: 4 }}
                  bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
                  borderRadius="lg"
                  borderLeftWidth="4px"
                  borderLeftColor={
                    index === 0 ? 'green.500' :
                    index === 1 ? 'blue.500' :
                    'purple.500'
                  }
                >
                  <HStack justify="space-between" flexWrap="wrap">
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.900' : 'white'}>
                        {item.type}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                        {item.count} {item.count === 1 ? 'position' : 'positions'}
                      </Text>
                    </VStack>
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={
                      index === 0 ? 'green.600' :
                      index === 1 ? 'blue.600' :
                      'purple.600'
                    }>
                      ${Math.round(item.avg)}k
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
