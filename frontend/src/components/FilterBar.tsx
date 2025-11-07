'use client';

import { Box, VStack, Input, Button, Text, SimpleGrid } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';

export interface FilterState {
  search: string;
  status: string;
  source: string;
  jobType: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableSources: string[];
  availableStatuses: string[];
  availableJobTypes: string[];
}

export function FilterBar({ filters, onFilterChange, availableSources, availableStatuses, availableJobTypes }: FilterBarProps) {
  const { colorMode } = useColorMode();
  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      status: '',
      source: '',
      jobType: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={colorMode === 'light' ? 'indigo.100' : 'gray.600'}
      shadow="lg"
      mb={6}
    >
      <VStack align="stretch" gap={5}>
        {/* Search Bar */}
        <Box>
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={3}>
            Search Applications
          </Text>
          <Input
            placeholder="Search by company, position, or notes..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            size={{ base: "md", md: "lg" }}
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
            color={colorMode === 'light' ? 'gray.900' : 'white'}
            borderRadius="lg"
            _hover={{ borderColor: 'indigo.300' }}
            _focus={{
              borderColor: 'indigo.500',
              bg: colorMode === 'light' ? 'white' : 'gray.600',
              shadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
            }}
          />
        </Box>

        {/* Filter Controls */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap={4}>
          {/* Status Filter */}
          <Box>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={2}>
              Status
            </Text>
            <select
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                fontSize: '16px',
                borderRadius: '8px',
                background: colorMode === 'light' ? '#f9fafb' : '#374151',
                color: colorMode === 'light' ? '#111827' : 'white',
                border: `1px solid ${colorMode === 'light' ? '#d1d5db' : '#4b5563'}`,
                cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Box>

          {/* Source Filter */}
          <Box>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={2}>
              Source
            </Text>
            <select
              value={filters.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                fontSize: '16px',
                borderRadius: '8px',
                background: colorMode === 'light' ? '#f9fafb' : '#374151',
                color: colorMode === 'light' ? '#111827' : 'white',
                border: `1px solid ${colorMode === 'light' ? '#d1d5db' : '#4b5563'}`,
                cursor: 'pointer',
              }}
            >
              <option value="">All Sources</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </Box>

          {/* Job Type Filter */}
          <Box>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={2}>
              Job Type
            </Text>
            <select
              value={filters.jobType}
              onChange={(e) => handleInputChange('jobType', e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                fontSize: '16px',
                borderRadius: '8px',
                background: colorMode === 'light' ? '#f9fafb' : '#374151',
                color: colorMode === 'light' ? '#111827' : 'white',
                border: `1px solid ${colorMode === 'light' ? '#d1d5db' : '#4b5563'}`,
                cursor: 'pointer',
              }}
            >
              <option value="">All Types</option>
              {availableJobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>
          </Box>

          {/* Date From */}
          <Box>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={2}>
              From Date
            </Text>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              size={{ base: "md", md: "lg" }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              color={colorMode === 'light' ? 'gray.900' : 'white'}
              borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
              borderRadius="lg"
              _hover={{ borderColor: 'indigo.300' }}
              _focus={{ borderColor: 'indigo.500', bg: colorMode === 'light' ? 'white' : 'gray.600', shadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' }}
            />
          </Box>

          {/* Date To */}
          <Box>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} mb={2}>
              To Date
            </Text>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              size={{ base: "md", md: "lg" }}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              color={colorMode === 'light' ? 'gray.900' : 'white'}
              borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
              borderRadius="lg"
              _hover={{ borderColor: 'indigo.300' }}
              _focus={{ borderColor: 'indigo.500', bg: colorMode === 'light' ? 'white' : 'gray.600', shadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' }}
            />
          </Box>
        </SimpleGrid>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Box>
            <Button
              onClick={handleReset}
              colorPalette="gray"
              variant="outline"
              size="sm"
            >
              Reset All Filters
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
