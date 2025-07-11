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

/**
 * Searches the Wikidata database for entities matching a search term.
 * @param searchTerm The term to search for.
 * @param limit The number of results to return.
 * @returns A promise resolving to an array of Wikidata entities.
 */
export async function searchWikidataEntities({ searchTerm, limit = 7 }: { searchTerm: string; limit?: number; }) {
    const url = new URL('https://www.wikidata.org/w/api.php');
    url.searchParams.set('action', 'wbsearchentities');
    url.searchParams.set('search', searchTerm);
    url.searchParams.set('language', 'en');
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.search?.map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
      })) || [];
    } catch (error) {
      console.error('Failed to search Wikidata API:', error);
      return [];
    }
}
