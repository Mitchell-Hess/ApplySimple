/**
 * Data normalization utilities for cleaning and standardizing application data
 */

// Normalize job type to standard values
export function normalizeJobType(jobType: string | null | undefined): string {
  if (!jobType) return 'Remote';

  const normalized = jobType.toLowerCase().trim();

  // Check for uncertainty indicators (question marks, "unsure", etc.)
  if (normalized.includes('?') || normalized.match(/unsure|unknown|tbd|to be determined/)) {
    return 'Unsure';
  }

  // Hybrid variations (check before remote since "remote or hybrid" should be hybrid)
  if (normalized.match(/hybrid|flex|flexible|part remote|partially remote|remote or hybrid|remote\/hybrid/)) {
    return 'Hybrid';
  }

  // Remote variations
  if (normalized.match(/remote|wfh|work from home|100% remote|fully remote/)) {
    return 'Remote';
  }

  // On-site variations
  if (normalized.match(/on-site|onsite|on site|in-office|in office|office|in person/)) {
    return 'On-site';
  }

  // Default to Unsure if no match
  return 'Unsure';
}

// Normalize status to standard values
export function normalizeStatus(status: string | null | undefined): string {
  if (!status) return 'Applied';

  const normalized = status.toLowerCase().trim();

  if (normalized.match(/^(applied|submitted|application sent)$/)) {
    return 'Applied';
  }

  if (normalized.match(/^(screening|phone screen|phone interview)$/)) {
    return 'Screening';
  }

  if (normalized.match(/^(interview|interviewing|technical interview|final interview)$/)) {
    return 'Interview';
  }

  if (normalized.match(/^(offer|offered|accepted)$/)) {
    return 'Offer';
  }

  if (normalized.match(/^(rejected|declined|not selected|no longer considered)$/)) {
    return 'Rejected';
  }

  if (normalized.match(/^(withdrawn|withdrew|cancelled)$/)) {
    return 'Withdrawn';
  }

  // Default to original value if no match (capitalized)
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

// Normalize source/platform names
export function normalizeSource(source: string | null | undefined): string {
  if (!source) return 'Other';

  const normalized = source.toLowerCase().trim();

  // LinkedIn variations
  if (normalized.match(/^(linkedin|linked in|linked-in)$/)) {
    return 'LinkedIn';
  }

  // Indeed variations
  if (normalized.match(/^(indeed)$/)) {
    return 'Indeed';
  }

  // Glassdoor variations
  if (normalized.match(/^(glassdoor|glass door)$/)) {
    return 'Glassdoor';
  }

  // Built In variations
  if (normalized.match(/^(built ?in|builtin)$/)) {
    return 'Built In';
  }

  // Otta variations
  if (normalized.match(/^(otta)$/)) {
    return 'Otta';
  }

  // AngelList variations
  if (normalized.match(/^(angellist|angel list|wellfound)$/)) {
    return 'AngelList';
  }

  // Company website variations
  if (normalized.match(/^(company ?website|direct|company ?site|careers ?page)$/)) {
    return 'Company Website';
  }

  // Referral variations
  if (normalized.match(/^(referral|referred|employee ?referral)$/)) {
    return 'Referral';
  }

  // Recruiter variations
  if (normalized.match(/^(recruiter|headhunter|recruitment ?agency)$/)) {
    return 'Recruiter';
  }

  // Default to original value if no match (title case)
  return source.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Normalize company name (basic cleaning)
export function normalizeCompany(company: string | null | undefined): string {
  if (!company) return '';

  return company
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/,?\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation)$/i, '') // Remove common suffixes
    .trim();
}

// Parse salary string to numeric value (in thousands)
// Examples: "$100k", "$100,000", "100000", "$100K-$120K", "100-120k"
export function parseSalary(salary: string | null | undefined): { min: number | null; max: number | null; display: string } {
  if (!salary) {
    return { min: null, max: null, display: '' };
  }

  const normalized = salary.trim().toLowerCase();

  // Extract numbers from string
  const numbers = normalized.match(/\d+[,\d]*/g);

  if (!numbers || numbers.length === 0) {
    return { min: null, max: null, display: salary };
  }

  // Remove commas and convert to number
  const values = numbers.map(n => parseInt(n.replace(/,/g, ''), 10));

  // Check if salary is in thousands (contains 'k') or full amount
  const isThousands = normalized.includes('k');

  // Convert to thousands
  const convertedValues = values.map(v => isThousands ? v : v / 1000);

  if (convertedValues.length === 1) {
    return {
      min: convertedValues[0],
      max: convertedValues[0],
      display: salary
    };
  } else {
    return {
      min: Math.min(...convertedValues),
      max: Math.max(...convertedValues),
      display: salary
    };
  }
}

// Format salary for display
export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Not specified';

  if (min === max || !max) {
    return `$${min}k`;
  }

  return `$${min}k - $${max}k`;
}

// Normalize all fields in an application object
export function normalizeApplication(app: Record<string, unknown>): Record<string, unknown> {
  return {
    ...app,
    jobType: normalizeJobType(app.jobType as string),
    status: normalizeStatus(app.status as string),
    foundOn: normalizeSource(app.foundOn as string),
    company: normalizeCompany(app.company as string),
  };
}
