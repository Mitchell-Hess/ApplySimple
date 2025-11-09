'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, VStack, Button, Text, HStack } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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

    setIsLoading(true);

    try {
      // Create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      // Sign in automatically
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but failed to sign in. Please try signing in manually.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign up error:', err);
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
              Create Account
            </Heading>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              Start tracking your job applications
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
                    Name (Optional)
                  </Text>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    style={inputStyle}
                  />
                </Box>

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

                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">
                    Password
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
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}

                <Button
                  type="submit"
                  bg="blue.600"
                  color="white"
                  size="lg"
                  width="100%"
                  loading={isLoading}
                  _hover={{ bg: 'blue.700' }}
                >
                  Sign Up
                </Button>
              </VStack>
            </form>
          </Box>

          <HStack justify="center" gap={2}>
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              Already have an account?
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
