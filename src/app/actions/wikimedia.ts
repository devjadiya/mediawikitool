'use server';

/**
 * @fileOverview Server actions for interacting with the MediaWiki API, specifically for UI components.
 */
const WIKI_API_USER_AGENT = 'Wikimedia-AI-Toolkit/1.0 (https://w.wiki/9sE9; )';

/**
 * Searches for Wikimedia users based on a prefix.
 * @param prefix The prefix to search for.
 * @returns A promise that resolves to an array of usernames.
 */
export async function searchUsers(prefix: string): Promise<string[]> {
  if (!prefix) {
    return [];
  }
  // Use 'user' search which is more relevant than 'allusers' for active contributors.
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    prefix
  )}&srwhat=user&srlimit=5&format=json&origin=*`;

  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': WIKI_API_USER_AGENT
        }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // The user search API returns titles as "User:<name>"
    return data.query.search.map((user: { title: string }) => user.title.replace('User:', ''));
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}
