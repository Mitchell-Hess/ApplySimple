// Dark mode compatible color utilities
export const bgColors = {
  page: { light: 'linear-gradient(to-br, #f8fafc 0%, #e0e7ff 50%, #fce7f3 100%)', dark: 'linear-gradient(to-br, #1a202c 0%, #2d3748 50%, #1a202c 100%)' },
  card: { light: 'white', dark: 'gray.800' },
  surface: { light: 'white', dark: 'gray.700' },
  hover: { light: 'gray.50', dark: 'gray.600' },
};

export const textColors = {
  primary: { light: 'gray.900', dark: 'gray.100' },
  secondary: { light: 'gray.600', dark: 'gray.400' },
  tertiary: { light: 'gray.500', dark: 'gray.500' },
  heading: { light: 'gray.900', dark: 'white' },
  muted: { light: 'gray.600', dark: 'gray.400' },
  subtle: { light: 'gray.700', dark: 'gray.300' },
};

export const borderColors = {
  card: { light: 'indigo.100', dark: 'gray.600' },
  subtle: { light: 'gray.200', dark: 'gray.600' },
  input: { light: 'gray.300', dark: 'gray.600' },
  hover: { light: 'indigo.300', dark: 'indigo.400' },
};

export const shadowColors = {
  card: { light: 'lg', dark: 'dark-lg' },
  elevated: { light: 'xl', dark: '2xl' },
};

// Helper to get color based on mode
export function getColor(colorObj: { light: string; dark: string }, mode: 'light' | 'dark') {
  return colorObj[mode];
}
