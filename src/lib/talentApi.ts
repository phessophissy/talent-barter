// Talent Protocol API integration (via API route to protect key)

export interface Builder {
  id: string;
  passport_id: number;
  name: string;
  display_name: string;
  avatar?: string;
  score: number;
  scoreBreakdown?: {
    activity_score?: number;
    identity_score?: number;
    skills_score?: number;
  };
  skills: string[];
  bio?: string;
  location?: string;
  tags: string[];
  verified: boolean;
  main_wallet?: string;
  socialLinks: string[];
  farcasterUrl?: string;
  contactUrl?: string;
}

export interface SearchParams {
  min_score?: number;
  skills?: string;
  location?: string;
  activity?: string;
}

export async function searchBuilders(params: SearchParams): Promise<Builder[]> {
  try {
    // Build query params for Talent Protocol API v2
    const queryParams: Record<string, string> = { endpoint: 'passports' };
    
    // Use API's keyword search for location or skills
    // This searches across name, bio, location, and tags
    if (params.location && params.location.trim()) {
      queryParams.keyword = params.location.trim();
    } else if (params.skills && params.skills.trim()) {
      // If no location, search by skill
      queryParams.keyword = params.skills.trim().split(',')[0].trim();
    }
    
    // Fetch multiple pages to get more results
    const pagesToFetch = 5; // Fetch 5 pages (125 builders max)
    let allPassports: any[] = [];
    
    for (let page = 1; page <= pagesToFetch; page++) {
      const pageParams = { ...queryParams, page: String(page) };
      const queryString = new URLSearchParams(pageParams).toString();
      const res = await fetch(`/api/talent?${queryString}`);
      
      if (!res.ok) {
        if (page === 1) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${res.status}`);
        }
        break; // Stop if subsequent pages fail
      }
      
      const data = await res.json();
      const passports = data.passports || [];
      
      if (passports.length === 0) break; // No more results
      
      allPassports = allPassports.concat(passports);
      
      // If we got less than expected, we've hit the last page
      if (passports.length < 25) break;
    }
    
    // Map all results first
    let builders: Builder[] = allPassports.map((p: any) => normalizeBuilder(p));
    
    // Remove duplicates by passport_id
    const seen = new Set<number>();
    builders = builders.filter(b => {
      if (seen.has(b.passport_id)) return false;
      seen.add(b.passport_id);
      return true;
    });
    
    // Check which filters are applied
    const hasLocationFilter = params.location && params.location.trim();
    const hasScoreFilter = params.min_score && params.min_score > 0;
    const hasSkillsFilter = params.skills && params.skills.trim();
    const hasActivityFilter = params.activity && params.activity.trim();
    const hasFilters = hasLocationFilter || hasScoreFilter || hasSkillsFilter || hasActivityFilter;
    
    if (!hasFilters) {
      // No filters - return all builders sorted by score
      return builders.sort((a: Builder, b: Builder) => b.score - a.score);
    }
    
    // Apply ALL filters as AND conditions (each filter narrows down results)
    
    // Filter by LOCATION (if specified) - more flexible matching
    if (hasLocationFilter) {
      const loc = params.location!.toLowerCase().trim();
      builders = builders.filter((b: Builder) => {
        // Check location field
        if (b.location?.toLowerCase().includes(loc)) return true;
        // Also check bio for location mentions
        if (b.bio?.toLowerCase().includes(loc)) return true;
        // Check if name contains location (e.g., "Lagos" in display name)
        if (b.display_name?.toLowerCase().includes(loc)) return true;
        return false;
      });
    }
    
    // Filter by MIN SCORE (if specified)
    if (hasScoreFilter) {
      builders = builders.filter((b: Builder) => b.score >= params.min_score!);
    }
    
    // Filter by SKILLS (if specified) - checks tags, skills array, and bio
    if (hasSkillsFilter) {
      const skillSearch = params.skills!.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
      builders = builders.filter((b: Builder) => {
        const hasMatchingTag = b.tags.some(tag => 
          skillSearch.some(s => tag.toLowerCase().includes(s))
        );
        const hasMatchingSkill = b.skills.some(skill => 
          skillSearch.some(s => skill.toLowerCase().includes(s))
        );
        const bioMatch = skillSearch.some(s => b.bio?.toLowerCase().includes(s));
        
        return hasMatchingTag || hasMatchingSkill || bioMatch;
      });
    }
    
    // Filter by ACTIVITY TYPE (if specified) - checks tags and bio
    if (hasActivityFilter) {
      const activitySearch = params.activity!.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
      builders = builders.filter((b: Builder) => {
        const hasMatchingTag = b.tags.some(tag => 
          activitySearch.some(s => tag.toLowerCase().includes(s))
        );
        const bioMatch = activitySearch.some(s => b.bio?.toLowerCase().includes(s));
        
        return hasMatchingTag || bioMatch;
      });
    }
    
    // Sort by score (highest first)
    builders.sort((a: Builder, b: Builder) => b.score - a.score);
    
    return builders;
  } catch (error: any) {
    console.error('searchBuilders error:', error);
    throw error;
  }
}

export async function getBuilderProfile(id: string): Promise<Builder | null> {
  try {
    const res = await fetch(`/api/talent?endpoint=passports/${encodeURIComponent(id)}`);
    
    if (!res.ok) {
      if (res.status === 404) return null;
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${res.status}`);
    }
    
    const data = await res.json();
    return normalizeBuilder(data.passport || data);
  } catch (error: any) {
    console.error('getBuilderProfile error:', error);
    throw error;
  }
}

// Normalize passport data from Talent Protocol API to our Builder interface
function normalizeBuilder(data: any): Builder {
  const profile = data.passport_profile || {};
  
  return {
    id: String(data.passport_id || data.id || ''),
    passport_id: data.passport_id || 0,
    name: profile.name || profile.display_name || 'Unknown Builder',
    display_name: profile.display_name || profile.name || 'Unknown Builder',
    avatar: profile.image_url || '',
    score: data.score || 0,
    scoreBreakdown: {
      activity_score: data.activity_score,
      identity_score: data.identity_score,
      skills_score: data.skills_score,
    },
    skills: profile.tags || [],
    bio: profile.bio || '',
    location: profile.location || '',
    tags: profile.tags || [],
    verified: data.verified || false,
    main_wallet: data.main_wallet || '',
    socialLinks: data.verified_wallets || [],
    farcasterUrl: profile.name ? `https://warpcast.com/${profile.name}` : '',
    contactUrl: data.main_wallet ? `https://celoscan.io/address/${data.main_wallet}` : '',
  };
}
