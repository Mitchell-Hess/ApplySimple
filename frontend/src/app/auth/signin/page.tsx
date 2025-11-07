'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, VStack, Button, Text, HStack, SimpleGrid, Grid } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import Link from 'next/link';
import { FiTrendingUp, FiBarChart2, FiTarget, FiCheckCircle } from 'react-icons/fi';

export default function SignInPage() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FiTarget,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place with detailed status tracking.',
    },
    {
      icon: FiTrendingUp,
      title: 'AI Predictions',
      description: 'Get success probability insights for each application based on historical patterns.',
    },
    {
      icon: FiBarChart2,
      title: 'Smart Analytics',
      description: 'Visualize trends, response rates, and identify what works best for you.',
    },
    {
      icon: FiCheckCircle,
      title: 'Action Insights',
      description: 'Receive personalized recommendations to improve your application strategy.',
    },
  ];

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} display="flex" alignItems="center">
      <Container maxW="7xl" py={{ base: 10, md: 16, lg: 20 }}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }}
          gap={{ base: 10, md: 12, lg: 16 }}
          alignItems="center"
        >
          {/* Left side - Branding and Features */}
          <VStack align="start" gap={{ base: 6, md: 8 }}>
            <VStack align="start" gap={4}>
              <Heading
                size={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={colorMode === 'light' ? 'gray.900' : 'white'}
                fontWeight="bold"
                lineHeight="1.2"
              >
                ApplySimple
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                maxW="xl"
                lineHeight="1.6"
              >
                Your intelligent job application tracker. Organize applications, track progress, and make smarter decisions with AI-powered insights.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 5 }} w="100%">
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={{ base: 4, md: 5 }}
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'md',
                    borderColor: colorMode === 'light' ? 'indigo.300' : 'indigo.500',
                  }}
                >
                  <VStack align="start" gap={3}>
                    <Box
                      p={2.5}
                      bg={colorMode === 'light' ? 'indigo.50' : 'indigo.900'}
                      borderRadius="lg"
                      color={colorMode === 'light' ? 'indigo.600' : 'indigo.300'}
                    >
                      <feature.icon size={22} />
                    </Box>
                    <VStack align="start" gap={1.5}>
                      <Text fontWeight="semibold" fontSize={{ base: 'md', md: 'lg' }} color={colorMode === 'light' ? 'gray.900' : 'white'}>
                        {feature.title}
                      </Text>
                      <Text fontSize={{ base: 'sm', md: 'md' }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'} lineHeight="1.5">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            {/* Additional Benefits */}
            <Box
              display={{ base: 'none', lg: 'block' }}
              p={5}
              bg={colorMode === 'light' ? 'indigo.50' : 'indigo.900/30'}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'indigo.200' : 'indigo.800'}
            >
              <VStack align="start" gap={2}>
                <Text fontWeight="semibold" color={colorMode === 'light' ? 'indigo.900' : 'indigo.200'}>
                  Join professionals who are landing their dream jobs
                </Text>
                <Text fontSize="sm" color={colorMode === 'light' ? 'indigo.700' : 'indigo.300'}>
                  Track applications, analyze patterns, and optimize your job search strategy with data-driven insights.
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Right side - Sign In Form */}
          <VStack gap={6} align="stretch">
            <VStack gap={2} textAlign={{ base: 'center', lg: 'left' }}>
              <Heading size={{ base: 'xl', md: '2xl' }} color={colorMode === 'light' ? 'gray.900' : 'white'}>
                Welcome Back
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Sign in to continue your job search journey
              </Text>
            </VStack>

            <Box
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              boxShadow="lg"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            >
              <form onSubmit={handleSubmit}>
                <VStack gap={5} align="stretch">
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
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium" fontSize="sm">
                        Password
                      </Text>
                      <Link href="/auth/forgot-password" style={{ color: '#3182ce', fontSize: '14px' }}>
                        Forgot?
                      </Link>
                    </HStack>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={inputStyle}
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
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>

            <HStack justify="center" gap={2} flexWrap="wrap">
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Don&apos;t have an account?
              </Text>
              <Link href="/auth/signup" style={{ color: '#3182ce', fontWeight: 600 }}>
                Sign Up
              </Link>
            </HStack>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}
