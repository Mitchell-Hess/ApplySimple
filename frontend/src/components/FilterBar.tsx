'use client';

import { Box, HStack, VStack, Input, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';

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
      p={6}
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      shadow="sm"
      mb={6}
    >
      <VStack align="stretch" gap={4}>
        {/* Search Bar */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
            Search
          </Text>
          <Input
            placeholder="Search by company, position, or notes..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            size="lg"
            bg="gray.50"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.400', bg: 'white' }}
          />
        </Box>

        {/* Filter Controls */}
        <HStack gap={4} flexWrap="wrap" align="end">
          {/* Status Filter */}
          <Box flex="1" minW="150px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              Status
            </Text>
            <Box
              as="select"
              value={filters.status}
              onChange={(e: any) => handleInputChange('status', e.target.value)}
              px={4}
              py={2}
              fontSize="md"
              borderRadius="md"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.400', bg: 'white', outline: 'none' }}
              cursor="pointer"
              width="100%"
              height="44px"
            >
              <option value="">All Statuses</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Box>
          </Box>

          {/* Source Filter */}
          <Box flex="1" minW="150px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              Source
            </Text>
            <Box
              as="select"
              value={filters.source}
              onChange={(e: any) => handleInputChange('source', e.target.value)}
              px={4}
              py={2}
              fontSize="md"
              borderRadius="md"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.400', bg: 'white', outline: 'none' }}
              cursor="pointer"
              width="100%"
              height="44px"
            >
              <option value="">All Sources</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Box>
          </Box>

          {/* Job Type Filter */}
          <Box flex="1" minW="150px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              Job Type
            </Text>
            <Box
              as="select"
              value={filters.jobType}
              onChange={(e: any) => handleInputChange('jobType', e.target.value)}
              px={4}
              py={2}
              fontSize="md"
              borderRadius="md"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.400', bg: 'white', outline: 'none' }}
              cursor="pointer"
              width="100%"
              height="44px"
            >
              <option value="">All Types</option>
              {availableJobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </Box>
          </Box>

          {/* Date From */}
          <Box flex="1" minW="150px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              From Date
            </Text>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              size="lg"
              bg="gray.50"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.400', bg: 'white' }}
            />
          </Box>

          {/* Date To */}
          <Box flex="1" minW="150px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              To Date
            </Text>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              size="lg"
              bg="gray.50"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.400', bg: 'white' }}
            />
          </Box>
        </HStack>

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
