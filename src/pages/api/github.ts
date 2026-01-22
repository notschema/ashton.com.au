/**
 * Server-side GitHub API proxy
 * Keeps the GITHUB_TOKEN secure by never exposing it to the client
 * Uses GraphQL API for accurate contribution counts (includes private repos)
 */
import type { APIRoute } from 'astro';

// Force server-side rendering for this API route
export const prerender = false;

const GITHUB_USERNAME = 'AshtonAU';

// GraphQL query for contribution calendar
const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

export const GET: APIRoute = async ({ request }) => {
  // Get token from env (works at build time for Vercel)
  const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ashton.com.au',
  };

  // Add auth header if token exists
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    // Fetch profile and repos via REST API
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers }),
    ]);

    const [profile, repos] = await Promise.all([
      profileRes.json(),
      reposRes.json(),
    ]);

    // Fetch contributions via GraphQL API (includes private repos!)
    let commitsThisYear = 0;
    let recentCommits: any[] = [];

    if (GITHUB_TOKEN) {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      try {
        const graphqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: CONTRIBUTIONS_QUERY,
            variables: {
              username: GITHUB_USERNAME,
              from: startOfYear.toISOString(),
              to: now.toISOString(),
            },
          }),
        });

        const graphqlData = await graphqlRes.json();
        
        // Log any GraphQL errors
        if (graphqlData.errors) {
          console.error('GraphQL errors:', graphqlData.errors);
        }
        
        if (graphqlData.data?.user?.contributionsCollection) {
          const collection = graphqlData.data.user.contributionsCollection;
          // Use calendar total as it's more accurate, with commits as fallback
          commitsThisYear = collection.contributionCalendar?.totalContributions || 
                           collection.totalCommitContributions + (collection.restrictedContributionsCount || 0);
          
          console.log('GraphQL contribution data:', {
            totalCommitContributions: collection.totalCommitContributions,
            restrictedContributionsCount: collection.restrictedContributionsCount,
            calendarTotal: collection.contributionCalendar?.totalContributions,
            finalCount: commitsThisYear,
          });
        }
      } catch (graphqlError) {
        console.error('GraphQL fetch error:', graphqlError);
      }
    }

    // Fetch recent events for commit messages (REST API)
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
      { headers }
    );
    const events = await eventsRes.json();

    if (Array.isArray(events)) {
      recentCommits = events
        .filter((event: any) => event.type === 'PushEvent' && event.payload?.commits?.length > 0)
        .flatMap((event: any) =>
          event.payload.commits.slice(0, 1).map((commit: any) => ({
            message: commit.message,
            repo: event.repo.name.split('/')[1],
            timestamp: event.created_at,
          }))
        )
        .slice(0, 5);
    }

    // Calculate language stats
    const langMap: Record<string, number> = {};
    if (Array.isArray(repos)) {
      repos.forEach((repo: any) => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });
    }

    const topLangs = Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([lang, count]) => ({
        name: lang,
        count,
        percentage: Math.round((count / repos.length) * 100),
      }));

    return new Response(
      JSON.stringify({
        profile,
        repos: Array.isArray(repos) ? repos.slice(0, 2) : [],
        languages: topLangs,
        commits: recentCommits,
        commitsThisYear,
        authenticated: !!GITHUB_TOKEN,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error('GitHub API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch GitHub data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
