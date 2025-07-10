'use server';

/**
 * @fileOverview Server actions for interacting with the MediaWiki API.
 */

 const WIKI_API_USER_AGENT = 'Wikimedia-AI-Toolkit/1.0 (https://github.com/your-repo/wmat; cooltool@example.com)';

/**
 * Searches for Wikimedia users based on a prefix.
 * @param prefix The prefix to search for.
 * @returns A promise that resolves to an array of usernames.
 */
export async function searchUsers(prefix: string): Promise<string[]> {
  if (!prefix) {
    return [];
  }
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=allusers&auprefix=${encodeURIComponent(
    prefix
  )}&aulimit=5&format=json&origin=*`;

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
    return data.query.allusers.map((user: { name: string }) => user.name);
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}

/**
 * Fetches basic user info for a given username.
 * @param username The username to fetch data for.
 * @returns A promise that resolves to the user's info.
 */
export async function getUserInfo(username: string) {
    const url = `https://xtools.wmcloud.org/api/user/simple_editcount/en.wikipedia.org/${encodeURIComponent(username)}?format=json&origin=*`;
    
    try {
        const response = await fetch(url, {
             headers: {
                'User-Agent': WIKI_API_USER_AGENT
            }
        });
        if (!response.ok) {
            throw new Error(`User not found or API error: ${response.statusText}`);
        }
        const data = await response.json();
        
        // The registration date is not in this API, let's get it from the main API
        const userDetailsUrl = `https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(username)}&usprop=registration&format=json&origin=*`;
        const userDetailsResponse = await fetch(userDetailsUrl, {
             headers: {
                'User-Agent': WIKI_API_USER_AGENT
            }
        });
        const userDetailsData = await userDetailsResponse.json();
        const registration = userDetailsData.query.users[0]?.registration;
        const formattedDate = registration ? new Date(registration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

        return {
            project: 'en.wikipedia.org',
            joinDate: formattedDate,
            totalEdits: data.total_edits || 0,
        }

    } catch(error) {
        console.error('Failed to get user info:', error);
        throw new Error(`Could not fetch data for user "${username}". Please check the username and try again.`);
    }
}