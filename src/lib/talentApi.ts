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
    const cleanParams: Record<string, string> = { endpoint: 'passports' };
    
    // The API doesn't support these filters directly, so we'll filter client-side
    // Just fetch passports and filter
    const queryString = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`/api/talent?${queryString}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Handle the passports response structure
    const passports = data.passports || [];
    
    // Map all results first
    let builders: Builder[] = passports.map((p: any) => normalizeBuilder(p));
    
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
    
    // Filter by LOCATION (if specified)
    if (hasLocationFilter) {
      const loc = params.location!.toLowerCase();
      builders = builders.filter((b: Builder) => 
        b.location?.toLowerCase().includes(loc)
      );
    }
    
    // Filter by MIN SCORE (if specified)
    if (hasScoreFilter) {
      builders = builders.filter((b: Builder) => b.score >= params.min_score!);
    }
    
    // Filter by SKILLS (if specified) - checks tags, skills array, and bio
    if (hasSkillsFilter) {
      const skillSearch = params.skills!.toLowerCase().split(',').map(s => s.trim());
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
      const activitySearch = params.activity!.toLowerCase().split(',').map(s => s.trim());
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
