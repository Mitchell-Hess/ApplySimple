'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface ColumnMapping {
  [csvColumn: string]: string | null;
}

export function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const { colorMode } = useColorMode();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'importing'>('upload');
  const [error, setError] = useState('');
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  // Expected fields in the database
  const requiredFields = [
    { key: 'company', label: 'Company (Required)', description: 'Name of the company (e.g., Google, Microsoft)' },
    { key: 'jobTitle', label: 'Job Title (Required)', description: 'Position title (e.g., Software Engineer, Product Manager)' },
    { key: 'dateApplied', label: 'Date Applied (Required)', description: 'Date format: YYYY-MM-DD or MM/DD/YYYY (e.g., 2025-01-15)' },
    { key: 'foundOn', label: 'Found On (Required)', description: 'Job source (e.g., LinkedIn, Indeed, Company Website)' },
  ];

  const optionalFields = [
    { key: 'salary', label: 'Salary', description: 'Salary range (e.g., $100k-$120k, 80000-100000)' },
    { key: 'jobType', label: 'Job Type', description: 'Work arrangement: Remote, Hybrid, or On-site' },
    { key: 'jobUrl', label: 'Job URL', description: 'Link to job posting (e.g., https://...)' },
    { key: 'status', label: 'Status', description: 'Application status: Applied, Screening, Interview, Offer, Rejected, or Withdrawn' },
    { key: 'coverLetterUsed', label: 'Cover Letter Used', description: 'Boolean: true/false, yes/no, or 1/0' },
    { key: 'numberOfRounds', label: 'Number of Rounds', description: 'Number of interview rounds (e.g., 3, 5)' },
    { key: 'dateOfOutcome', label: 'Date of Outcome', description: 'Date format: YYYY-MM-DD or MM/DD/YYYY' },
    { key: 'notes', label: 'Notes', description: 'Additional information or comments about the application' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#4a5568'}`,
    background: colorMode === 'light' ? 'white' : '#2d3748',
    color: colorMode === 'light' ? 'black' : 'white',
    fontSize: '14px',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const fileName = uploadedFile.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (!isCSV && !isExcel) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    setFile(uploadedFile);
    setError('');

    if (isCSV) {
      // Parse CSV
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as Record<string, string>[];
          if (data.length === 0) {
            setError('CSV file is empty');
            return;
          }

          const columns = Object.keys(data[0]);
          setCsvData(data);
          setCsvColumns(columns);

          // Auto-map columns that match
          const autoMapping: ColumnMapping = {};
          columns.forEach(col => {
            const normalized = col.toLowerCase().trim();
            // Try to find matching field
            [...requiredFields, ...optionalFields].forEach(field => {
              if (normalized === field.key.toLowerCase() ||
                  normalized === field.label.toLowerCase() ||
                  normalized.includes(field.key.toLowerCase())) {
                autoMapping[col] = field.key;
              }
            });
          });

          setColumnMapping(autoMapping);
          setStep('mapping');
        },
        error: (err) => {
          setError(`Failed to parse CSV: ${err.message}`);
        },
      });
    } else {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const binaryStr = evt.target?.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });

          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const data = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as Record<string, string>[];

          if (data.length === 0) {
            setError('Excel file is empty');
            return;
          }

          const columns = Object.keys(data[0]);
          setCsvData(data);
          setCsvColumns(columns);

          // Auto-map columns that match
          const autoMapping: ColumnMapping = {};
          columns.forEach(col => {
            const normalized = col.toLowerCase().trim();
            // Try to find matching field
            [...requiredFields, ...optionalFields].forEach(field => {
              if (normalized === field.key.toLowerCase() ||
                  normalized === field.label.toLowerCase() ||
                  normalized.includes(field.key.toLowerCase())) {
                autoMapping[col] = field.key;
              }
            });
          });

          setColumnMapping(autoMapping);
          setStep('mapping');
        } catch (err) {
          setError(`Failed to parse Excel file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const handleImport = async () => {
    // Validate that all required fields are mapped
    const missingRequired = requiredFields.filter(
      field => !Object.values(columnMapping).includes(field.key)
    );

    if (missingRequired.length > 0) {
      setError(`Please map these required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    setStep('importing');
    setError('');
    setImportProgress({ current: 0, total: csvData.length });

    try {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        setImportProgress({ current: i + 1, total: csvData.length });

        // Map CSV columns to application fields
        const applicationData: Record<string, unknown> = {};
        Object.entries(columnMapping).forEach(([csvCol, dbField]) => {
          if (dbField && row[csvCol]) {
            let value: unknown = row[csvCol].trim();

            // Type conversions
            if (dbField === 'coverLetterUsed') {
              value = value === 'true' || value === '1' || value === 'yes';
            } else if (dbField === 'numberOfRounds') {
              value = parseInt(value as string) || undefined;
            }

            applicationData[dbField] = value;
          }
        });

        // Send to API
        try {
          const response = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch {
          errorCount++;
        }
      }

      const message = `Import complete! Successfully imported ${successCount} applications. ${errorCount > 0 ? `${errorCount} failed.` : ''}`;
      onSuccess(message);
      handleClose();
    } catch (err) {
      setError('Import failed. Please try again.');
      setStep('mapping');
    }
  };

  const handleClose = () => {
    setFile(null);
    setCsvData([]);
    setCsvColumns([]);
    setColumnMapping({});
    setStep('upload');
    setError('');
    setImportProgress({ current: 0, total: 0 });
    onClose();
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
      onClick={handleClose}
    >
      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        p={6}
        maxW="700px"
        w="90%"
        maxH="90vh"
        overflowY="auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        boxShadow="xl"
      >
        <Heading size="xl" mb={4}>
          Import Applications
        </Heading>

        {step === 'upload' && (
          <VStack align="stretch" gap={4}>
            <Box>
              <Text fontSize="md" mb={3} fontWeight="medium">
                Upload a CSV or Excel file (.csv, .xlsx, .xls) with your job applications.
              </Text>
              <Text fontSize="sm" mb={4} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Your file should include these columns. Column names will be auto-detected, but you can manually map them in the next step.
              </Text>

              <VStack align="start" gap={2} mb={3}>
                <Text fontSize="sm" fontWeight="bold" color="blue.600">Required Fields:</Text>
                {requiredFields.map(field => (
                  <Box key={field.key} pl={4}>
                    <Text fontSize="sm" fontWeight="semibold">{field.label}</Text>
                    <Text fontSize="xs" color={colorMode === 'light' ? 'gray.600' : 'gray.400'} pl={2}>
                      {field.description}
                    </Text>
                  </Box>
                ))}

                <Text fontSize="sm" fontWeight="bold" color="green.600" mt={2}>Optional Fields:</Text>
                {optionalFields.map(field => (
                  <Box key={field.key} pl={4}>
                    <Text fontSize="sm" fontWeight="semibold">{field.label}</Text>
                    <Text fontSize="xs" color={colorMode === 'light' ? 'gray.600' : 'gray.400'} pl={2}>
                      {field.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium" fontSize="sm">Select File:</Text>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                style={inputStyle}
              />
            </Box>

            {error && (
              <Text color="red.500" fontSize="sm">{error}</Text>
            )}

            <HStack justify="flex-end">
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
            </HStack>
          </VStack>
        )}

        {step === 'mapping' && (
          <VStack align="stretch" gap={4}>
            <Text fontSize="md" mb={2}>
              Map your CSV columns to application fields. Found {csvData.length} rows.
            </Text>

            <Box maxH="400px" overflowY="auto">
              <VStack align="stretch" gap={3}>
                {[...requiredFields, ...optionalFields].map(field => (
                  <Box key={field.key}>
                    <Text mb={1} fontWeight="medium" fontSize="sm">
                      {field.label}
                    </Text>
                    <select
                      value={
                        Object.entries(columnMapping).find(([, val]) => val === field.key)?.[0] || ''
                      }
                      onChange={(e) => {
                        const newMapping = { ...columnMapping };
                        // Remove old mapping for this field
                        Object.keys(newMapping).forEach(key => {
                          if (newMapping[key] === field.key) {
                            newMapping[key] = null;
                          }
                        });
                        // Add new mapping
                        if (e.target.value) {
                          newMapping[e.target.value] = field.key;
                        }
                        setColumnMapping(newMapping);
                      }}
                      style={inputStyle}
                    >
                      <option value="">-- Not Mapped --</option>
                      {csvColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </Box>
                ))}
              </VStack>
            </Box>

            {error && (
              <Text color="red.500" fontSize="sm">{error}</Text>
            )}

            <HStack justify="flex-end">
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                bg="green.600"
                color="white"
                _hover={{ bg: 'green.700' }}
              >
                Import {csvData.length} Applications
              </Button>
            </HStack>
          </VStack>
        )}

        {step === 'importing' && (
          <VStack align="stretch" gap={4}>
            <Text fontSize="lg" fontWeight="bold">
              Importing Applications...
            </Text>
            <Text fontSize="md">
              Progress: {importProgress.current} / {importProgress.total}
            </Text>
            <Box
              w="100%"
              h="20px"
              bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="100%"
                bg="green.500"
                transition="width 0.3s"
                w={`${(importProgress.current / importProgress.total) * 100}%`}
              />
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  );
}
