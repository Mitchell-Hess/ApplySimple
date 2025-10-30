'use client';

import { Box, Table, Badge } from '@chakra-ui/react';
import { Application } from '@/types/application';

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

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <Box p={8} textAlign="center" color="gray.500">
        No applications yet. Start adding your job applications!
      </Box>
    );
  }

  return (
    <Box overflowX="auto" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Company</Table.ColumnHeader>
            <Table.ColumnHeader>Job Title</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Found On</Table.ColumnHeader>
            <Table.ColumnHeader>Date Applied</Table.ColumnHeader>
            <Table.ColumnHeader>Salary</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {applications.map((app) => (
            <Table.Row key={app.id}>
              <Table.Cell fontWeight="medium">{app.company}</Table.Cell>
              <Table.Cell>{app.jobTitle}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={statusColors[app.status] || 'gray'}>
                  {app.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{app.foundOn}</Table.Cell>
              <Table.Cell>
                {new Date(app.dateApplied).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{app.salary || '-'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
