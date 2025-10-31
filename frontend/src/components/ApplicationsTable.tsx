'use client';

import { Box, Table, Badge, Text, HStack, Link, Button, Icon } from '@chakra-ui/react';
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

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
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
      let aVal: any;
      let bVal: any;

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <Icon fontSize="sm" color="gray.400"><LuArrowUpDown /></Icon>;
    }
    if (sortDirection === 'asc') {
      return <Icon fontSize="sm" color="blue.600"><LuArrowUp /></Icon>;
    }
    return <Icon fontSize="sm" color="blue.600"><LuArrowDown /></Icon>;
  };

  if (applications.length === 0) {
    return (
      <Box p={{ base: 6, md: 8 }} textAlign="center" color="gray.500" bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
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
        borderColor="gray.200"
        bg="white"
        shadow="sm"
      >
        <Table.Root size="sm" variant="outline">
          <Table.Header bg="gray.50" borderBottomWidth="2px" borderColor="gray.200">
            <Table.Row>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.700"
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('company')}
                _hover={{ bg: 'gray.100' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Company</Text>
                  <SortIcon field="company" />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.700"
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('jobTitle')}
                _hover={{ bg: 'gray.100' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Job Title</Text>
                  <SortIcon field="jobTitle" />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Type</Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.700"
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('salary')}
                _hover={{ bg: 'gray.100' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Salary</Text>
                  <SortIcon field="salary" />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.700"
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('status')}
                _hover={{ bg: 'gray.100' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Status</Text>
                  <SortIcon field="status" />
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Rounds</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Source</Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.700"
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleSort('dateApplied')}
                _hover={{ bg: 'gray.100' }}
                userSelect="none"
              >
                <HStack gap={1}>
                  <Text>Applied</Text>
                  <SortIcon field="dateApplied" />
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
                bg: 'gray.50'
              }}
              transition="background 0.2s"
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              <Table.Cell>
                <Text fontWeight="semibold" color="gray.900" fontSize="sm">
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
                  <Text fontSize="sm" color="gray.700">{app.jobTitle}</Text>
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
                  <Text color="gray.400" fontSize="xs">-</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color="gray.700" fontWeight="medium">
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
                      <Text fontSize="xs" color="gray.500">
                        {app.numberOfRounds === 1 ? 'round' : 'rounds'}
                      </Text>
                    </>
                  ) : (
                    <Text color="gray.400" fontSize="xs">-</Text>
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color="gray.600">
                  {app.foundOn}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color="gray.600">
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
                  <Text color="gray.500" fontSize="xs">No</Text>
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
