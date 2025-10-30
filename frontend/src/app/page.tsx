'use client';

import { Box, Container, Grid, GridItem, Heading, SimpleGrid, Spinner, Text, VStack, HStack, Badge, Flex, Icon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications, fetchStats } from '@/lib/api';
import { StatsCard } from '@/components/StatsCard';
import { ApplicationsTable } from '@/components/ApplicationsTable';
import { StatusChart } from '@/components/StatusChart';
import { SourceAnalytics } from '@/components/SourceAnalytics';
import { FilterBar, FilterState } from '@/components/FilterBar';
import { useState, useMemo } from 'react';
import { Application } from '@/types/application';

export default function Home() {
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
    const jobTypes = new Set(applications.map(app => app.jobType).filter(Boolean));
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
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="linear-gradient(135deg, #f0fdf4 0%, #fef3f2 100%)">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading your applications...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="linear-gradient(135deg, #f0fdf4 0%, #fef3f2 100%)">
        <VStack gap={3}>
          <Text fontSize="4xl">⚠️</Text>
          <Text color="red.500" fontSize="lg" fontWeight="medium">Error loading applications</Text>
          <Text color="gray.600" fontSize="sm">Please try refreshing the page</Text>
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
    <Box minH="100vh" bg="linear-gradient(135deg, #f0fdf4 0%, #fef3f2 100%)" py={8}>
      <Container maxW="7xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box py={6}>
            <VStack align="start" gap={4} mb={6}>
              <Heading
                size="3xl"
                fontWeight="bold"
                color="gray.900"
                letterSpacing="tight"
              >
                ApplySimple
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="3xl" lineHeight="tall">
                A comprehensive job application tracking system that helps you organize, monitor, and analyze your job search.
                Track applications, visualize your pipeline, and gain insights into your application success rates across different platforms and job types.
              </Text>
            </VStack>
            <HStack gap={4} flexWrap="wrap">
              <Badge
                size="lg"
                px={4}
                py={2}
                borderRadius="md"
                bg="green.100"
                color="green.800"
                fontWeight="semibold"
              >
                {stats?.totalApplications || 0} Total Applications
              </Badge>
              <Badge
                size="lg"
                px={4}
                py={2}
                borderRadius="md"
                bg="blue.100"
                color="blue.800"
                fontWeight="semibold"
              >
                {stats?.recentApplications || 0} Recent (30 days)
              </Badge>
            </HStack>
          </Box>

          {/* Primary Stats Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
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
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            <Box
              p={6}
              bg="green.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="green.200"
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <Text fontSize="xs" color="green.700" mb={2} fontWeight="semibold">
                Top Source
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                {topSource?.source || 'N/A'}
              </Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {topSource?.count || 0} applications
              </Text>
            </Box>

            <Box
              p={6}
              bg="orange.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="orange.200"
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <Text fontSize="xs" color="orange.700" mb={2} fontWeight="semibold">
                Remote Jobs
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                {remoteJobs}
              </Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {stats?.totalApplications ? ((remoteJobs / stats.totalApplications) * 100).toFixed(0) : 0}% of total
              </Text>
            </Box>

            <Box
              p={6}
              bg="purple.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="purple.200"
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <Text fontSize="xs" color="purple.700" mb={2} fontWeight="semibold">
                Cover Letters
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                {stats?.withCoverLetters || 0}
              </Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {stats?.totalApplications ? ((stats.withCoverLetters / stats.totalApplications) * 100).toFixed(0) : 0}% of apps
              </Text>
            </Box>

            <Box
              p={6}
              bg="blue.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="blue.200"
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <Text fontSize="xs" color="blue.700" mb={2} fontWeight="semibold">
                Active Pipeline
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                {activeApplications + interviews}
              </Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {activeApplications} applied, {interviews} interviewing
              </Text>
            </Box>
          </SimpleGrid>

          {/* Chart Section */}
          {applications && applications.length > 0 && (
            <Box
              p={6}
              bg="linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.300"
              shadow="sm"
            >
              <VStack align="stretch" gap={4}>
                <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                  <VStack align="start" gap={1}>
                    <Heading size="lg" color="gray.900" fontWeight="bold">
                      Application Status Overview
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Visual breakdown of your application pipeline
                    </Text>
                  </VStack>
                  <Badge
                    size="md"
                    px={4}
                    py={2}
                    borderRadius="md"
                    bg="white"
                    color="gray.700"
                    fontWeight="semibold"
                    borderWidth="1px"
                    borderColor="gray.300"
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
            <HStack justify="space-between" mb={4} flexWrap="wrap" gap={3}>
              <Heading size="lg" color="gray.900">Applications</Heading>
              <HStack gap={3}>
                <Badge
                  colorPalette="green"
                  size="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="green.100"
                  color="green.800"
                  borderWidth="1px"
                  borderColor="green.300"
                >
                  {filteredApplications.length} filtered
                </Badge>
                <Badge
                  colorPalette="gray"
                  size="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="gray.100"
                  color="gray.700"
                  borderWidth="1px"
                  borderColor="gray.300"
                >
                  {applications?.length || 0} total
                </Badge>
              </HStack>
            </HStack>

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
