'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Container, Heading, VStack, Button, Text, HStack } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colorMode } = useColorMode();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

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

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (!hasNumber || !hasLetter) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
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
              Reset Password
            </Heading>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'} textAlign="center">
              Enter your new password below.
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
                    New Password
                  </Text>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    minLength={8}
                  />
                  <Text fontSize="xs" color={colorMode === 'light' ? 'gray.500' : 'gray.400'} mt={1}>
                    Must be at least 8 characters with one letter and one number
                  </Text>
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">
                    Confirm Password
                  </Text>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    minLength={8}
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
                    <Text color="green.700" fontSize="sm">
                      {success}
                    </Text>
                    <Text color="green.600" fontSize="xs" mt={1}>
                      Redirecting to sign in...
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  bg="blue.600"
                  color="white"
                  size="lg"
                  width="100%"
                  loading={isLoading}
                  disabled={isLoading || !token || !!success}
                  _hover={{ bg: 'blue.700' }}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Box minH="100vh" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
