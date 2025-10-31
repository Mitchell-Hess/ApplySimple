'use client';

import { Box, Table, Badge, Text, HStack, Link, Button, Icon } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { Application } from '@/types/application';
import { useState, useMemo } from 'react';
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from 'react-icons/lu';

interface ApplicationsTableProps {
  applications: Application[];
}

type SortField = 'company' | 'jobTitle' | 'dateApplied' | 'status' | 'salary';
type SortDirection = 'asc' | 'desc' | null;

const statusColors: Record<string, string> = {
  Applied: 'blue',
  Screening: 'yellow',
  Interview: 'purple',
  Offer: 'green',
  Rejected: 'red',
  Withdrawn: 'gray',
};

const jobTypeColors: Record<string, string> = {
  Remote: 'green',
  Hybrid: 'orange',
  'On-site': 'purple',
};

// SortIcon component defined outside of render to avoid React hooks warnings
interface SortIconProps {
  field: SortField;
  currentField: SortField | null;
  currentDirection: SortDirection;
  colorMode: 'light' | 'dark';
}

function SortIcon({ field, currentField, currentDirection, colorMode }: SortIconProps) {
  if (currentField !== field) {
    return <Icon fontSize="sm" color={colorMode === 'light' ? 'gray.400' : 'gray.500'}><LuArrowUpDown /></Icon>;
  }
  if (currentDirection === 'asc') {
    return <Icon fontSize="sm" color="blue.600"><LuArrowUp /></Icon>;
  }
  return <Icon fontSize="sm" color="blue.600"><LuArrowDown /></Icon>;
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const { colorMode } = useColorMode();
  const [showAll, setShowAll] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedApplications = useMemo(() => {
    if (!sortField || !sortDirection) return applications;

    return [...applications].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'company':
          aVal = a.company.toLowerCase();
          bVal = b.company.toLowerCase();
          break;
        case 'jobTitle':
          aVal = a.jobTitle.toLowerCase();
          bVal = b.jobTitle.toLowerCase();
          break;
        case 'dateApplied':
          aVal = new Date(a.dateApplied).getTime();
          bVal = new Date(b.dateApplied).getTime();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'salary':
          // Extract numeric value from salary string
          aVal = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, '')) || 0 : 0;
          bVal = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, '')) || 0 : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [applications, sortField, sortDirection]);

  const displayedApps = showAll ? sortedApplications : sortedApplications.slice(0, 10);

  if (applications.length === 0) {
    return (
      <Box p={{ base: 6, md: 8 }} textAlign="center" color={colorMode === 'light' ? 'gray.500' : 'gray.400'} bg={colorMode === 'light' ? 'white' : 'gray.800'} borderRadius="xl" borderWidth="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}>
        <Text fontSize={{ base: "sm", md: "md" }}>No applications yet. Start adding your job applications!</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        overflowX="auto"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        shadow="sm"
      >
        <Table.Root size="sm" variant="outline">
          <Table.Header bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} borderBottomWidth="2px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}>
            <Table.Row>
              <Table.ColumnHeader
                fontWeight="semibold"
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('company')}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Company</Text>
                  <SortIcon field="company" currentField={sortField} currentDirection={sortDirection} colorMode={colorMode} />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('jobTitle')}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Job Title</Text>
                  <SortIcon field="jobTitle" currentField={sortField} currentDirection={sortDirection} colorMode={colorMode} />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Type</Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('salary')}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Salary</Text>
                  <SortIcon field="salary" currentField={sortField} currentDirection={sortDirection} colorMode={colorMode} />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('status')}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Status</Text>
                  <SortIcon field="status" currentField={sortField} currentDirection={sortDirection} colorMode={colorMode} />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Rounds</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Source</Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('dateApplied')}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Applied</Text>
                  <SortIcon field="dateApplied" currentField={sortField} currentDirection={sortDirection} colorMode={colorMode} />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Cover Letter</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {displayedApps.map((app) => (
            <Table.Row
              key={app.id}
              _hover={{
                bg: colorMode === 'light' ? 'gray.50' : 'gray.700'
              }}
              transition="background 0.2s"
              borderBottomWidth="1px"
              borderColor={colorMode === 'light' ? 'gray.100' : 'gray.600'}
            >
              <Table.Cell>
                <Text fontWeight="semibold" color={colorMode === 'light' ? 'gray.900' : 'white'} fontSize="sm">
                  {app.company}
                </Text>
              </Table.Cell>
              <Table.Cell maxW="250px">
                {app.jobUrl ? (
                  <Link
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.600"
                    _hover={{ color: 'blue.700', textDecoration: 'underline' }}
                    fontSize="sm"
                  >
                    {app.jobTitle}
                  </Link>
                ) : (
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>{app.jobTitle}</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                {app.jobType ? (
                  <Badge
                    colorPalette={jobTypeColors[app.jobType] || 'gray'}
                    size="sm"
                  >
                    {app.jobType}
                  </Badge>
                ) : (
                  <Text color={colorMode === 'light' ? 'gray.400' : 'gray.500'} fontSize="xs">-</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} fontWeight="medium">
                  {app.salary || '-'}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={statusColors[app.status] || 'gray'} size="sm">
                  {app.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack gap={1}>
                  {app.numberOfRounds && app.numberOfRounds > 0 ? (
                    <>
                      <Badge colorPalette="purple" size="sm">
                        {app.numberOfRounds}
                      </Badge>
                      <Text fontSize="xs" color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                        {app.numberOfRounds === 1 ? 'round' : 'rounds'}
                      </Text>
                    </>
                  ) : (
                    <Text color={colorMode === 'light' ? 'gray.400' : 'gray.500'} fontSize="xs">-</Text>
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  {app.foundOn}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  {new Date(app.dateApplied).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {app.coverLetterUsed ? (
                  <Badge colorPalette="green" size="sm">
                    Yes
                  </Badge>
                ) : (
                  <Text color={colorMode === 'light' ? 'gray.500' : 'gray.400'} fontSize="xs">No</Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>

    {!showAll && applications.length > 10 && (
      <Box mt={{ base: 3, md: 4 }} textAlign="center">
        <Button
          onClick={() => setShowAll(true)}
          colorPalette="green"
          size={{ base: "md", md: "lg" }}
          variant="outline"
        >
          Show All {applications.length} Applications
        </Button>
      </Box>
    )}

    {showAll && applications.length > 10 && (
      <Box mt={{ base: 3, md: 4 }} textAlign="center">
        <Button
          onClick={() => setShowAll(false)}
          colorPalette="gray"
          size={{ base: "md", md: "lg" }}
          variant="outline"
        >
          Show Less
        </Button>
      </Box>
    )}
  </Box>
  );
}
