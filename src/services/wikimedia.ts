'use server';

import { format, subYears } from 'date-fns';

/**
 * @fileOverview Services for interacting with the MediaWiki and XTools APIs.
 * This file is marked with "use server" and only exports async functions.
 */

const WIKI_API_USER_AGENT = 'Wikimedia-AI-Toolkit/1.0 (https://w.wiki/9sE9; )';
const XTOOLS_BASE_URL = 'https://xtools.wmcloud.org/api';

/**
 * Fetches basic user info for a given username to find their home project.
 * @param username The username to fetch data for.
 * @returns A promise that resolves to the user's basic info.
 */
async function getSimpleUserInfo(username: string) {
    const url = `${XTOOLS_BASE_URL}/user/simple_editcount/global/${encodeURIComponent(username)}`;
    try {
        const response = await fetch(url, { headers: { 'User-Agent': WIKI_API_USER_AGENT } });
        if (!response.ok) return { project: null, total_edits: 0 };
        const data = await response.json();
        // The project is often 'www.wikidata.org', we need to strip 'www.'
        const project = data.project?.replace('www.', '');
        return { project, total_edits: data.total_edits };
    } catch (error) {
        console.error(`Failed to get simple user info for ${username}:`, error);
        return { project: null, total_edits: 0 };
    }
}

/**
 * Fetches user registration date from their home wiki.
 * @param username The username to fetch data for.
 * @returns A promise that resolves to the user's registration date as a string.
 */
async function getUserRegistrationDate(username: string) {
    // Meta wiki is a good fallback for global registration info
    const url = `https://meta.wikimedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(username)}&usprop=registration&format=json&origin=*`;
    try {
        const response = await fetch(url, { headers: { 'User-Agent': WIKI_API_USER_AGENT } });
        if (!response.ok) return 'N/A';
        const data = await response.json();
        const registration = data.query.users[0]?.registration;
        return registration ? new Date(registration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    } catch (error) {
        console.error(`Failed to get registration date for ${username}:`, error);
        return 'N/A';
    }
}

/**
 * Fetches the user's edit counts per namespace for their home project.
 * @param project The user's home project (e.g., en.wikipedia.org).
 * @param username The username.
 * @returns A promise resolving to namespace edit data.
 */
async function getNamespaceData(project: string, username: string) {
    const url = `${XTOOLS_BASE_URL}/user/namespace_totals/${project}/${encodeURIComponent(username)}`;
    try {
        const response = await fetch(url, { headers: { 'User-Agent': WIKI_API_USER_AGENT } });
        if (!response.ok) return [];
        const data = await response.json();
        const namespaces = data.namespaces || {};
        return Object.entries(namespaces)
            .map(([id, ns]: any) => ({
                id: parseInt(id),
                name: ns.name || `Namespace ${id}`,
                edits: ns.edits || 0
            }))
            .filter(ns => ns.edits > 0)
            .sort((a, b) => b.edits - a.edits)
            .slice(0, 6); // Take top 6 for pie chart readability
    } catch (error) {
        console.error(`Failed to get namespace data for ${username} on ${project}:`, error);
        return [];
    }
}

/**
 * Fetches the user's edit counts per month for their home project.
 * @param project The user's home project.
 * @param username The username.
 * @returns A promise resolving to monthly edit data.
 */
async function getMonthlyEdits(project: string, username: string) {
    const url = `${XTOOLS_BASE_URL}/user/month_counts/${project}/${encodeURIComponent(username)}`;
    try {
        const response = await fetch(url, { headers: { 'User-Agent': WIKI_API_USER_AGENT } });
        if (!response.ok) return [];
        const data = await response.json();
        const counts = data.month_counts || {};
        const oneYearAgo = subYears(new Date(), 1);
        
        return Object.entries(counts)
            .map(([dateStr, namespaces]: any) => {
                const [year, month] = dateStr.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                const totalEdits = Object.values(namespaces).reduce((sum: any, ns: any) => sum + (ns.edits || 0), 0) as number;
                return {
                    date: format(date, 'MMM yyyy'),
                    fullDate: date,
                    edits: totalEdits
                };
            })
            .filter(d => d.fullDate >= oneYearAgo)
            .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    } catch (error) {
        console.error(`Failed to get monthly edits for ${username} on ${project}:`, error);
        return [];
    }
}

/**
 * Fetches the user's most edited pages on their home project.
 * @param project The user's home project.
 * @param username The username.
 * @returns A promise resolving to an array of top edited pages.
 */
async function getTopPages(project: string, username: string) {
    const url = `${XTOOLS_BASE_URL}/user/top_edits/${project}/${encodeURIComponent(username)}`;
     try {
        const response = await fetch(url, { headers: { 'User-Agent': WIKI_API_USER_AGENT } });
        if (!response.ok) return [];
        const data = await response.json();
        // The API returns { page_title, count, namespace }
        return data.top_pages ? data.top_pages.map((p: any) => ({
            title: p.page_title.replace(/_/g, ' '),
            edits: p.count,
            namespace: p.namespace
        })) : [];
    } catch (error) {
        console.error(`Failed to get top pages for ${username} on ${project}:`, error);
        return [];
    }
}

/**
 * Fetches and aggregates all contribution data for a user.
 * @param username The username to fetch data for.
 * @returns A promise resolving to the complete user contribution data object.
 */
export async function getUserContributionData(username: string) {
    if (!username) {
        throw new Error('Username cannot be empty.');
    }

    try {
        // Fetch basic info first to get the home project
        const userInfo = await getSimpleUserInfo(username);
        // If user is not found or has no home project, throw an error
        if (!userInfo.project) {
            throw new Error(`Could not determine home project for user "${username}". The user may not exist or have any edits.`);
        }
        const project = userInfo.project;

        // Fetch all other data in parallel
        const [
            joinDate,
            namespaceData,
            monthlyEdits,
            topPages,
        ] = await Promise.all([
            getUserRegistrationDate(username),
            getNamespaceData(project, username),
            getMonthlyEdits(project, username),
            getTopPages(project, username),
        ]);

        return {
            username: username,
            project: project,
            totalEdits: userInfo.total_edits,
            joinDate,
            namespaceData: namespaceData.map(ns => ({...ns, name: ns.name.replace(/_/g, ' ')})),
            monthlyEdits: monthlyEdits.map(m => ({date: m.date, edits: m.edits})),
            topPages: topPages,
        };

    } catch(error: any) {
        console.error('Failed to get user contribution data:', error);
        throw new Error(error.message || `Could not fetch data for user "${username}". The API might be unavailable.`);
    }
}
