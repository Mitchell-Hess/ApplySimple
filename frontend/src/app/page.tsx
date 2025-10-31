'use client';

import { Box, Container, Grid, GridItem, Heading, SimpleGrid, Spinner, Text, VStack, HStack, Badge, Flex, Icon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications, fetchStats } from '@/lib/api';
import { StatsCard } from '@/components/StatsCard';
import { ApplicationsTable } from '@/components/ApplicationsTable';
import { StatusChart } from '@/components/StatusChart';
import { SourceAnalytics } from '@/components/SourceAnalytics';
import { FilterBar, FilterState } from '@/components/FilterBar';
import { ColorModeToggle } from '@/components/ColorModeToggle';
import { useColorMode } from '@/lib/color-mode';
import { useState, useMemo } from 'react';
import { Application } from '@/types/application';

export default function Home() {
  const { colorMode } = useColorMode();
  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    source: '',
    jobType: '',
    dateFrom: '',
    dateTo: '',
  });

  // Get unique values for filter dropdowns
  const availableSources = useMemo(() => {
    if (!applications) return [];
    const sources = new Set(applications.map(app => app.foundOn));
    return Array.from(sources).sort();
  }, [applications]);

  const availableStatuses = useMemo(() => {
    if (!applications) return [];
    const statuses = new Set(applications.map(app => app.status));
    return Array.from(statuses).sort();
  }, [applications]);

  const availableJobTypes = useMemo(() => {
    if (!applications) return [];
    const jobTypes = new Set(applications.map(app => app.jobType).filter((jt): jt is string => Boolean(jt)));
    return Array.from(jobTypes).sort();
  }, [applications]);

  // Filter applications based on current filters
  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    return applications.filter((app: Application) => {
      // Search filter (company, job title, notes)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          app.company.toLowerCase().includes(searchLower) ||
          app.jobTitle.toLowerCase().includes(searchLower) ||
          (app.notes && app.notes.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && app.status !== filters.status) {
        return false;
      }

      // Source filter
      if (filters.source && app.foundOn !== filters.source) {
        return false;
      }

      // Job Type filter
      if (filters.jobType && app.jobType !== filters.jobType) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const appDate = new Date(app.dateApplied);
        const fromDate = new Date(filters.dateFrom);
        if (appDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const appDate = new Date(app.dateApplied);
        const toDate = new Date(filters.dateTo);
        if (appDate > toDate) return false;
      }

      return true;
    });
  }, [applications, filters]);

  const isLoading = appsLoading || statsLoading;
  const error = appsError || statsError;

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={colorMode === 'light'
          ? 'linear-gradient(135deg, #f0fdf4 0%, #fef3f2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        }
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>Loading your applications...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={colorMode === 'light'
          ? 'linear-gradient(135deg, #f0fdf4 0%, #fef3f2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        }
      >
        <VStack gap={3}>
          <Text fontSize="4xl">⚠️</Text>
          <Text color="red.500" fontSize="lg" fontWeight="medium">Error loading applications</Text>
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontSize="sm">Please try refreshing the page</Text>
        </VStack>
      </Box>
    );
  }

  // Calculate derived stats
  const activeApplications = stats?.statusCounts.find(s => s.status === 'Applied')?.count || 0;
  const interviews = stats?.statusCounts.find(s => s.status === 'Interview')?.count || 0;
  const offers = stats?.statusCounts.find(s => s.status === 'Offer')?.count || 0;
  const rejected = stats?.statusCounts.find(s => s.status === 'Rejected')?.count || 0;

  const responseRate = stats?.totalApplications
    ? ((stats.withOutcomes / stats.totalApplications) * 100).toFixed(1)
    : 0;

  const interviewRate = stats?.totalApplications
    ? ((stats.withInterviews / stats.totalApplications) * 100).toFixed(1)
    : 0;

  const topSource = stats?.sourceCounts[0];
  const remoteJobs = stats?.jobTypeCounts.find(j => j.jobType === 'Remote')?.count || 0;

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light'
        ? 'linear-gradient(to-br, #f8fafc 0%, #e0e7ff 50%, #fce7f3 100%)'
        : 'linear-gradient(to-br, #1a202c 0%, #2d3748 50%, #1a202c 100%)'
      }
      py={{ base: 4, md: 8 }}
      overflowX="hidden"
      w="100%"
    >
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 5, md: 6 }} align="stretch">
          {/* Header */}
          <Box
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            shadow="lg"
            borderWidth="1px"
            borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
          >
            <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
              <Box flex="1">
                <Heading
                  size={{ base: "xl", md: "3xl" }}
                  fontWeight="bold"
                  color={colorMode === 'light' ? 'gray.900' : 'white'}
                  mb={2}
                >
                  ApplySimple
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'} fontSize={{ base: "sm", md: "md" }} maxW="2xl">
                  Your intelligent job application tracking platform
                </Text>
              </Box>
              <HStack gap={{ base: 2, md: 3 }} flexWrap="wrap">
                <ColorModeToggle />
                <Badge
                  px={{ base: 4, md: 5 }}
                  py={{ base: 2, md: 3 }}
                  borderRadius="xl"
                  bg="blue.600"
                  color="white"
                  fontWeight="semibold"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {stats?.totalApplications || 0} Applications
                </Badge>
                <Badge
                  px={{ base: 4, md: 5 }}
                  py={{ base: 2, md: 3 }}
                  borderRadius="xl"
                  bg="purple.600"
                  color="white"
                  fontWeight="semibold"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {stats?.withInterviews || 0} Interviews
                </Badge>
              </HStack>
            </HStack>
          </Box>

          {/* Primary Stats Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 4, md: 6 }}>
            <StatsCard
              label="Total Applications"
              value={stats?.totalApplications || 0}
              color="mint"
              subtitle={`${stats?.recentApplications || 0} this month`}
            />
            <StatsCard
              label="Interview Rate"
              value={`${interviewRate}%`}
              color="peach"
              subtitle={`${stats?.withInterviews || 0} total interviews`}
            />
            <StatsCard
              label="Response Rate"
              value={`${responseRate}%`}
              color="lavender"
              subtitle={`${stats?.avgResponseTime || 0} days avg`}
            />
            <StatsCard
              label="Offers Received"
              value={offers}
              color="sky"
              subtitle={`${rejected} rejections`}
            />
          </SimpleGrid>

          {/* Secondary Stats Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 4, md: 5 }}>
            <Box
              p={{ base: 5, md: 6 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="green.200"
              shadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: 'green.400',
              }}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                Top Source
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="green.700">
                {topSource?.source || 'N/A'}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.800' : 'gray.300'} mt={1} fontWeight="medium">
                {topSource?.count || 0} applications
              </Text>
            </Box>

            <Box
              p={{ base: 5, md: 6 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="orange.200"
              shadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: 'orange.400',
              }}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                Remote Jobs
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="orange.600">
                {remoteJobs}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.800' : 'gray.300'} mt={1} fontWeight="medium">
                {stats?.totalApplications ? ((remoteJobs / stats.totalApplications) * 100).toFixed(0) : 0}% of total
              </Text>
            </Box>

            <Box
              p={{ base: 5, md: 6 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="pink.200"
              shadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: 'pink.400',
              }}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                Cover Letters
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="pink.600">
                {stats?.withCoverLetters || 0}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.800' : 'gray.300'} mt={1} fontWeight="medium">
                {stats?.totalApplications ? ((stats.withCoverLetters / stats.totalApplications) * 100).toFixed(0) : 0}% of apps
              </Text>
            </Box>

            <Box
              p={{ base: 5, md: 6 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="#c7d2fe"
              shadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: '#818cf8',
              }}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                Active Pipeline
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="indigo.600">
                {activeApplications + interviews}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={colorMode === 'light' ? 'gray.800' : 'gray.300'} mt={1} fontWeight="medium">
                {activeApplications} applied, {interviews} interviewing
              </Text>
            </Box>
          </SimpleGrid>

          {/* Chart Section */}
          {applications && applications.length > 0 && (
            <Box
              p={{ base: 5, md: 7 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
              shadow="lg"
            >
              <VStack align="stretch" gap={{ base: 5, md: 6 }}>
                <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
                  <VStack align="start" gap={1}>
                    <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold">
                      Application Status Overview
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                      Visual breakdown of your application pipeline
                    </Text>
                  </VStack>
                  <Badge
                    px={{ base: 4, md: 5 }}
                    py={2}
                    borderRadius="lg"
                    bg="blue.600"
                    color="white"
                    fontWeight="semibold"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {applications.length} Total
                  </Badge>
                </HStack>
                <StatusChart applications={applications} />
              </VStack>
            </Box>
          )}

          {/* Analytics Section */}
          {stats && <SourceAnalytics stats={stats} />}

          {/* Applications Table */}
          <Box>
            <Box
              mb={6}
              p={{ base: 5, md: 6 }}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
              shadow="lg"
            >
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <Box>
                  <Heading size={{ base: "lg", md: "xl" }} color={colorMode === 'light' ? 'gray.900' : 'white'} fontWeight="bold" mb={1}>
                    All Applications
                  </Heading>
                  <Text fontSize={{ base: "sm", md: "md" }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    View and manage your job applications
                  </Text>
                </Box>
                <HStack gap={{ base: 2, md: 3 }} flexWrap="wrap">
                  <Badge
                    px={{ base: 4, md: 5 }}
                    py={2}
                    borderRadius="lg"
                    bg="green.700"
                    color="white"
                    fontWeight="semibold"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {filteredApplications.length} Shown
                  </Badge>
                  <Badge
                    px={{ base: 4, md: 5 }}
                    py={2}
                    borderRadius="lg"
                    bg="blue.600"
                    color="white"
                    fontWeight="semibold"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {applications?.length || 0} Total
                  </Badge>
                </HStack>
              </HStack>
            </Box>

            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              availableSources={availableSources}
              availableStatuses={availableStatuses}
              availableJobTypes={availableJobTypes}
            />

            <ApplicationsTable applications={filteredApplications} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
