'use client';

import { Box, Table, Badge, Text, HStack, Link, Button } from '@chakra-ui/react';
import { Application } from '@/types/application';
import { useState } from 'react';

interface ApplicationsTableProps {
  applications: Application[];
}

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
  const displayedApps = showAll ? applications : applications.slice(0, 10);

  if (applications.length === 0) {
    return (
      <Box p={8} textAlign="center" color="gray.500" bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
        No applications yet. Start adding your job applications!
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
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Company</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Job Title</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Type</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Salary</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Status</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Rounds</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Source</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="gray.700" fontSize="xs">Applied</Table.ColumnHeader>
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
      <Box mt={4} textAlign="center">
        <Button
          onClick={() => setShowAll(true)}
          colorPalette="green"
          size="lg"
          variant="outline"
        >
          Show All {applications.length} Applications
        </Button>
      </Box>
    )}

    {showAll && applications.length > 10 && (
      <Box mt={4} textAlign="center">
        <Button
          onClick={() => setShowAll(false)}
          colorPalette="gray"
          size="lg"
          variant="outline"
        >
          Show Less
        </Button>
      </Box>
    )}
  </Box>
  );
}
