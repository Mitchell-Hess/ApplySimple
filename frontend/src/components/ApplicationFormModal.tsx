'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { Application } from '@/types/application';
import { createApplication, updateApplication } from '@/lib/api';

interface ApplicationFormModalProps {
  application?: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type StatusType = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';

export function ApplicationFormModal({ application, isOpen, onClose, onSuccess }: ApplicationFormModalProps) {
  const { colorMode } = useColorMode();
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    salary: '',
    jobType: 'Remote',
    jobUrl: '',
    dateApplied: new Date().toISOString().split('T')[0],
    foundOn: 'LinkedIn',
    coverLetterUsed: false,
    numberOfRounds: undefined as number | undefined,
    dateOfOutcome: '',
    notes: '',
    status: 'Applied' as StatusType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Style for form inputs
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#4a5568'}`,
    background: colorMode === 'light' ? 'white' : '#2d3748',
    color: colorMode === 'light' ? 'black' : 'white',
    fontSize: '14px',
  };

  // Helper function to format date for input[type="date"] (YYYY-MM-DD in local timezone)
  const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayForInput = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Populate form when editing
  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || '',
        jobTitle: application.jobTitle || '',
        salary: application.salary || '',
        jobType: application.jobType || 'Remote',
        jobUrl: application.jobUrl || '',
        dateApplied: formatDateForInput(application.dateApplied) || getTodayForInput(),
        foundOn: application.foundOn || 'LinkedIn',
        coverLetterUsed: application.coverLetterUsed || false,
        numberOfRounds: application.numberOfRounds || undefined,
        dateOfOutcome: formatDateForInput(application.dateOfOutcome),
        notes: application.notes || '',
        status: application.status || 'Applied',
      });
    } else {
      // Reset form for new application
      setFormData({
        company: '',
        jobTitle: '',
        salary: '',
        jobType: 'Remote',
        jobUrl: '',
        dateApplied: getTodayForInput(),
        foundOn: 'LinkedIn',
        coverLetterUsed: false,
        numberOfRounds: undefined,
        dateOfOutcome: '',
        notes: '',
        status: 'Applied' as StatusType,
      });
    }
    setError('');
  }, [application, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        dateApplied: new Date(formData.dateApplied),
        numberOfRounds: formData.numberOfRounds || undefined,
        dateOfOutcome: formData.dateOfOutcome ? new Date(formData.dateOfOutcome) : undefined,
      };

      if (application) {
        await updateApplication(application.id, dataToSubmit);
      } else {
        await createApplication(dataToSubmit);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
      onClick={onClose}
    >
      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        p={6}
        maxW="600px"
        w="90%"
        maxH="90vh"
        overflowY="auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        boxShadow="xl"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {application ? 'Edit Application' : 'Add New Application'}
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            {/* Company */}
            <Box>
              <Text mb={1} fontWeight="medium">Company *</Text>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                placeholder="e.g., Google"
                style={inputStyle}
              />
            </Box>

            {/* Job Title */}
            <Box>
              <Text mb={1} fontWeight="medium">Job Title *</Text>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                required
                placeholder="e.g., Software Engineer"
                style={inputStyle}
              />
            </Box>

            {/* Salary */}
            <Box>
              <Text mb={1} fontWeight="medium">Salary</Text>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., $100k-$120k"
                style={inputStyle}
              />
            </Box>

            {/* Job Type */}
            <Box>
              <Text mb={1} fontWeight="medium">Job Type</Text>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                style={inputStyle}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </Box>

            {/* Job URL */}
            <Box>
              <Text mb={1} fontWeight="medium">Job URL</Text>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
            </Box>

            {/* Date Applied */}
            <Box>
              <Text mb={1} fontWeight="medium">Date Applied *</Text>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                required
                style={inputStyle}
              />
            </Box>

            {/* Source */}
            <Box>
              <Text mb={1} fontWeight="medium">Found On *</Text>
              <select
                value={formData.foundOn}
                onChange={(e) => setFormData({ ...formData, foundOn: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Built In">Built In</option>
                <option value="Otta">Otta</option>
                <option value="AngelList">AngelList</option>
                <option value="Company Website">Company Website</option>
                <option value="Referral">Referral</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Other">Other</option>
              </select>
            </Box>

            {/* Status */}
            <Box>
              <Text mb={1} fontWeight="medium">Status</Text>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusType })}
                style={inputStyle}
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </Box>

            {/* Cover Letter Used */}
            <Box>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.coverLetterUsed}
                  onChange={(e) => setFormData({ ...formData, coverLetterUsed: e.target.checked })}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <Text fontWeight="medium">Cover Letter Used</Text>
              </label>
            </Box>

            {/* Number of Interview Rounds */}
            <Box>
              <Text mb={1} fontWeight="medium">Number of Interview Rounds</Text>
              <input
                type="number"
                min="0"
                value={formData.numberOfRounds || ''}
                onChange={(e) => setFormData({ ...formData, numberOfRounds: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="e.g., 3"
                style={inputStyle}
              />
            </Box>

            {/* Date of Outcome */}
            <Box>
              <Text mb={1} fontWeight="medium">Date of Outcome</Text>
              <input
                type="date"
                value={formData.dateOfOutcome}
                onChange={(e) => setFormData({ ...formData, dateOfOutcome: e.target.value })}
                style={inputStyle}
              />
            </Box>

            {/* Notes */}
            <Box>
              <Text mb={1} fontWeight="medium">Notes</Text>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </Box>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}

            <HStack justify="flex-end" mt={4}>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="blue.600"
                color="white"
                _hover={{ bg: 'blue.700' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (application ? 'Update' : 'Create')}
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
