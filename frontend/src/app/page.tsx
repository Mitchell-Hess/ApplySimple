'use client';

import { Box, Container, Heading, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications } from '@/lib/api';
import { StatsCard } from '@/components/StatsCard';
import { ApplicationsTable } from '@/components/ApplicationsTable';
import { StatusChart } from '@/components/StatusChart';

export default function Home() {
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="red.500">Error loading applications</Text>
      </Box>
    );
  }

  const totalApplications = applications?.length || 0;
  const activeApplications = applications?.filter(
    app => !['Rejected', 'Withdrawn', 'Offer'].includes(app.status)
  ).length || 0;
  const interviews = applications?.filter(app => app.status === 'Interview').length || 0;
  const avgSuccess = applications?.length
    ? (applications.reduce((sum, app) => sum + (app.predictedSuccess || 0), 0) / applications.length * 100).toFixed(0)
    : 0;

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} py={8}>
      <Container maxW="7xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2}>ApplySimple Dashboard</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              Track and analyze your job applications with ML-powered insights
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <StatsCard
              label="Total Applications"
              value={totalApplications}
              color="blue"
            />
            <StatsCard
              label="Active"
              value={activeApplications}
              color="purple"
            />
            <StatsCard
              label="Interviews"
              value={interviews}
              color="green"
            />
            <StatsCard
              label="Avg Success Rate"
              value={`${avgSuccess}%`}
              color="teal"
            />
          </SimpleGrid>

          {/* Chart */}
          {applications && applications.length > 0 && (
            <Box
              p={6}
              bg="white"
              _dark={{ bg: 'gray.800' }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <StatusChart applications={applications} />
            </Box>
          )}

          {/* Applications Table */}
          <Box>
            <Heading size="lg" mb={4}>Recent Applications</Heading>
            <ApplicationsTable applications={applications || []} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
