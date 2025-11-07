'use client';

import { useState } from 'react';
import { Box, Container, Heading, VStack, Button, Text, HStack } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#4a5568'}`,
    background: colorMode === 'light' ? 'white' : '#2d3748',
    color: colorMode === 'light' ? 'black' : 'white',
    fontSize: '16px',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetUrl('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      } else {
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} py={12}>
      <Container maxW="md">
        <VStack gap={8} align="stretch">
          <VStack gap={2}>
            <Heading size="2xl" color={colorMode === 'light' ? 'gray.900' : 'white'}>
              Forgot Password?
            </Heading>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'} textAlign="center">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
          </VStack>

          <Box
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
          >
            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">
                    Email
                  </Text>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </Box>

                {error && (
                  <Box p={3} borderRadius="md" bg="red.50" borderWidth="1px" borderColor="red.200">
                    <Text color="red.700" fontSize="sm">
                      {error}
                    </Text>
                  </Box>
                )}

                {success && (
                  <Box p={3} borderRadius="md" bg="green.50" borderWidth="1px" borderColor="green.200">
                    <Text color="green.700" fontSize="sm" mb={resetUrl ? 2 : 0}>
                      {success}
                    </Text>
                    {resetUrl && (
                      <Box mt={2}>
                        <Text color="green.700" fontSize="xs" fontWeight="bold" mb={1}>
                          Development Mode - Reset Link:
                        </Text>
                        <Link href={resetUrl} style={{ color: '#2563eb', fontSize: '12px', wordBreak: 'break-all' }}>
                          Click here to reset password
                        </Link>
                      </Box>
                    )}
                  </Box>
                )}

                <Button
                  type="submit"
                  bg="blue.600"
                  color="white"
                  size="lg"
                  width="100%"
                  loading={isLoading}
                  disabled={isLoading}
                  _hover={{ bg: 'blue.700' }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </VStack>
            </form>
          </Box>

          <HStack justify="center" gap={2}>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              Remember your password?
            </Text>
            <Link href="/auth/signin" style={{ color: '#3182ce', fontWeight: 600 }}>
              Sign In
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
