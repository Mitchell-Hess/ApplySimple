'use client';

import { Box, Button, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'blue.600',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colorMode } = useColorMode();

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
      zIndex="2000"
      onClick={onCancel}
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
          <Heading size="lg" color={colorMode === 'light' ? 'gray.900' : 'white'}>
            {title}
          </Heading>

          <Text fontSize="md" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
            {message}
          </Text>

          <HStack justify="flex-end" gap={3}>
            <Button onClick={onCancel} variant="outline">
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              bg={confirmColor}
              color="white"
              _hover={{ opacity: 0.9 }}
            >
              {confirmText}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
