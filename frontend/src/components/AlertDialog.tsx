'use client';

import { Box, Button, VStack, Text, Heading } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function AlertDialog({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
}: AlertDialogProps) {
  const { colorMode } = useColorMode();

  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          titleColor: 'green.600',
          buttonBg: 'green.600',
        };
      case 'error':
        return {
          titleColor: 'red.600',
          buttonBg: 'red.600',
        };
      default:
        return {
          titleColor: 'blue.600',
          buttonBg: 'blue.600',
        };
    }
  };

  const colors = getColors();

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
      zIndex="2000"
      onClick={onClose}
    >
      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="lg"
        p={6}
        maxW="500px"
        w="90%"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        boxShadow="xl"
      >
        <VStack align="stretch" gap={4}>
          <Heading size="lg" color={colors.titleColor}>
            {title}
          </Heading>

          <Text fontSize="md" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
            {message}
          </Text>

          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={onClose}
              bg={colors.buttonBg}
              color="white"
              _hover={{ opacity: 0.9 }}
            >
              OK
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
