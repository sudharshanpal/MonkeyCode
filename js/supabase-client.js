// Supabase client for frontend
// Uses the public anon key (safe to expose in client-side code)

class SupabaseProblemsClient {
    constructor() {
        // Replace these with your actual Supabase credentials
        // IMPORTANT: Use the ANON key here, NOT the service role key
        this.supabaseUrl = 'https://kwquxvwofxuqrfruxffp.supabase.co';
        this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cXV4dndvZnh1cXJmcnV4ZmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODk0MTUsImV4cCI6MjA3ODQ2NTQxNX0.kant3oPbWCrArHmIM30p8vUQni7sFpod6jiLa31aDeA';
        
        // Initialize Supabase client
        // The CDN exposes it as window.supabase.createClient
        try {
            if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
                this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
                console.log('✅ Supabase client initialized');
            } else {
                console.error('❌ Supabase client library not loaded. Make sure the CDN script is loaded before this script.');
                this.client = null;
            }
        } catch (error) {
            console.error('❌ Error initializing Supabase client:', error);
            this.client = null;
        }
        
        // Cache for problems
        this.cache = {
            problems: {},
            microDrills: {}
        };
    }
    
    // Fetch all problems for a specific language and topic
    async getProblemsByTopic(topic, language = 'python') {
        if (!this.client) {
            console.warn('⚠️ Supabase client not initialized');
            return [];
        }
        
        const cacheKey = `${language}::${topic}`;
        
        // Return cached data if available
        if (this.cache.problems[cacheKey]) {
            return this.cache.problems[cacheKey];
        }
        
        try {
            const { data, error } = await this.client
                .from('problems')
                .select('*')
                .eq('language', language)
                .eq('topic', topic);
            
            if (error) throw error;
            
            // Cache the results
            this.cache.problems[cacheKey] = data || [];
            return data || [];
        } catch (error) {
            console.error('Error fetching problems:', error);
            return [];
        }
    }
    
    // Get a random problem for a specific topic and language
    async getRandomProblemByTopic(topic, language = 'python') {
        const problems = await this.getProblemsByTopic(topic, language);
        
        if (problems.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * problems.length);
        return problems[randomIndex];
    }
    
    // Fetch all micro drills for a specific language
    async getMicroDrillsForLanguage(language = 'python') {
        if (!this.client) {
            console.warn('⚠️ Supabase client not initialized');
            return [];
        }
        
        const cacheKey = language;
        
        // Return cached data if available
        if (this.cache.microDrills[cacheKey]) {
            return this.cache.microDrills[cacheKey];
        }
        
        try {
            const { data, error } = await this.client
                .from('micro_drills')
                .select('*')
                .eq('language', language);
            
            if (error) throw error;
            
            // Cache the results
            this.cache.microDrills[cacheKey] = data || [];
            return data || [];
        } catch (error) {
            console.error('Error fetching micro drills:', error);
            return [];
        }
    }
    
    // Get a random micro drill for a specific language
    async getRandomMicroDrill(language = 'python') {
        const drills = await this.getMicroDrillsForLanguage(language);
        
        if (drills.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * drills.length);
        return drills[randomIndex];
    }
    
    // Get all available topics for a language
    async getAvailableTopics(language = 'python') {
        try {
            const { data, error } = await this.client
                .from('problems')
                .select('topic')
                .eq('language', language);
            
            if (error) throw error;
            
            // Get unique topics
            const topics = [...new Set(data.map(row => row.topic))];
            return topics;
        } catch (error) {
            console.error('Error fetching topics:', error);
            return [];
        }
    }
    
    // Prefetch all data for better performance (call this on app init)
    async prefetchAllData(language = 'python') {
        if (!this.client) {
            console.warn('⚠️ Supabase client not initialized, skipping prefetch');
            return false;
        }
        
        try {
            // Fetch all problems and micro drills in parallel
            const [problemsResult, drillsResult] = await Promise.all([
                this.client.from('problems').select('*').eq('language', language),
                this.client.from('micro_drills').select('*').eq('language', language)
            ]);
            
            if (problemsResult.error) throw problemsResult.error;
            if (drillsResult.error) throw drillsResult.error;
            
            // Organize problems by topic in cache
            const problems = problemsResult.data || [];
            problems.forEach(problem => {
                const cacheKey = `${problem.language}::${problem.topic}`;
                if (!this.cache.problems[cacheKey]) {
                    this.cache.problems[cacheKey] = [];
                }
                this.cache.problems[cacheKey].push(problem);
            });
            
            // Cache micro drills
            this.cache.microDrills[language] = drillsResult.data || [];
            
            console.log(`✅ Prefetched ${problems.length} problems and ${drillsResult.data.length} drills`);
            return true;
        } catch (error) {
            console.error('Error prefetching data:', error);
            return false;
        }
    }
    
    // Clear cache (useful for testing or when data changes)
    clearCache() {
        this.cache = {
            problems: {},
            microDrills: {}
        };
    }
}

// Create global instance
window.supabaseProblemsClient = new SupabaseProblemsClient();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseProblemsClient;
}
