/**
 * C4ISR Data Sources Management System
 * Integrates multiple flight tracking data sources for comprehensive coverage
 */

class DataSourceManager {
    constructor() {
        this.sources = {};
        this.activeSources = new Set();
        this.connectionStatus = {};
        this.dataCache = new Map();
        this.updateIntervals = new Map();
        this.requestCounters = new Map();
        this.lastUpdate = {};
        
        this.initializeSources();
        this.setupEventListeners();
        this.startMonitoring();
        
        // Try activating any sources that are checked in the UI at startup
        setTimeout(() => {
            try { this.activateCheckedSources(); } catch (e) { console.warn('Activate checked sources failed:', e); }
        }, 0);
    }
    
    /**
     * Initialize all data sources
     */
    initializeSources() {
        // FlightRadar24 Source
        this.sources.flightradar24 = {
            name: 'FlightRadar24',
            config: C4ISR_CONFIG.DATA_SOURCES.FLIGHTRADAR24,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // OpenSky Network Source
        this.sources.opensky = {
            name: 'OpenSky Network',
            config: C4ISR_CONFIG.DATA_SOURCES.OPENSKY,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // ADSB.lol Source
        this.sources.adsb = {
            name: 'ADSB.lol',
            config: C4ISR_CONFIG.DATA_SOURCES.ADSB,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // KiwiSDR Source
        this.sources.kiwisdr = {
            name: 'KiwiSDR',
            config: C4ISR_CONFIG.DATA_SOURCES.KIWISDR,
            status: 'offline',
            lastData: null,
            errorCount: 0,
            retryAttempts: 0
        };
        
        // Initialize connection status
        Object.keys(this.sources).forEach(sourceKey => {
            this.connectionStatus[sourceKey] = 'disconnected';
            this.requestCounters[sourceKey] = { count: 0, lastReset: Date.now() };
            this.lastUpdate[sourceKey] = null;
        });
    }
    
    /**
     * Setup event listeners for source controls
     */
    setupEventListeners() {
        // Source checkboxes
        const sourceCheckboxes = document.querySelectorAll('[id$="-source"]');
        sourceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const sourceKey = e.target.id.replace('-source', '');
                if (e.target.checked) {
                    this.activateSource(sourceKey);
                } else {
                    this.deactivateSource(sourceKey);
                }
            });
        });
        
        // Language change events
        window.addEventListener('languageChanged', () => {
            this.updateSourceStatus();
        });
    }
    
    /**
     * Attempt to activate all sources whose checkboxes are checked
     */
    activateCheckedSources() {
        const sourceCheckboxes = document.querySelectorAll('[id$="-source"]');
        sourceCheckboxes.forEach(checkbox => {
            const sourceKey = checkbox.id.replace('-source', '');
            if (checkbox.checked) {
                this.activateSource(sourceKey);
            }
        });
    }
    
    /**
     * Start monitoring all sources
     */
    startMonitoring() {
        // Check initial status
        this.checkAllSources();
        
        // Start periodic status checks
        setInterval(() => {
            this.checkAllSources();
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Check status of all sources
     */
    async checkAllSources() {
        const promises = Object.keys(this.sources).map(sourceKey => 
            this.checkSourceStatus(sourceKey)
        );
        
        await Promise.allSettled(promises);
        this.updateSourceStatus();
    }
    
    /**
     * Check status of a specific source
     * @param {string} sourceKey - Source identifier
     */
    async checkSourceStatus(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return;
        
        try {
            // Test connection to source
            const isOnline = await this.testSourceConnection(sourceKey);
            
            if (isOnline) {
                source.status = 'online';
                source.errorCount = 0;
                source.retryAttempts = 0;
                this.connectionStatus[sourceKey] = 'connected';
            } else {
                source.status = 'offline';
                this.connectionStatus[sourceKey] = 'disconnected';
            }
        } catch (error) {
            console.warn(`Error checking ${sourceKey} status:`, error);
            source.status = 'offline';
            this.connectionStatus[sourceKey] = 'error';
        }
    }
    
    /**
     * Test connection to a data source
     * @param {string} sourceKey - Source identifier
     * @returns {Promise<boolean>} Connection status
     */
    async testSourceConnection(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return false;
        
        try {
            const config = source.config;
            let testUrl = '';
            
            switch (sourceKey) {
                case 'flightradar24':
                    testUrl = `${config.BASE_URL}/status.js`;
                    break;
                case 'opensky':
                    testUrl = `${config.BASE_URL}/states/all`;
                    break;
                case 'adsb':
                    testUrl = `${config.BASE_URL}/status`;
                    break;
                case 'kiwisdr':
                    testUrl = `${config.BASE_URL}/status`;
                    break;
                default:
                    return false;
            }
            
            const response = await this.makeRequest(testUrl, {
                timeout: 5000,
                method: 'GET'
            });
            
            return response.ok;
        } catch (error) {
            console.warn(`Connection test failed for ${sourceKey}:`, error);
            return false;
        }
    }
    
    /**
     * Activate a data source
     * @param {string} sourceKey - Source identifier
     */
    activateSource(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || this.activeSources.has(sourceKey)) return;
        
        // Allow activation even if status probe fails; fetching will determine health
        this.activeSources.add(sourceKey);
        this.connectionStatus[sourceKey] = 'connecting';
        this.startDataUpdates(sourceKey);
        
        // Kick off an immediate fetch so UI updates quickly
        this.updateSourceData(sourceKey).catch(() => {});
        
        // Update UI
        this.updateSourceStatus();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('sourceActivated', {
            detail: { source: sourceKey }
        }));
        
        console.log(`Data source ${sourceKey} activated`);
    }
    
    /**
     * Deactivate a data source
     * @param {string} sourceKey - Source identifier
     */
    deactivateSource(sourceKey) {
        if (!this.activeSources.has(sourceKey)) return;
        
        this.activeSources.delete(sourceKey);
        this.stopDataUpdates(sourceKey);
        
        // Update UI
        this.updateSourceStatus();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('sourceDeactivated', {
            detail: { source: sourceKey }
        }));
        
        console.log(`Data source ${sourceKey} deactivated`);
    }
    
    /**
     * Start data updates for a source
     * @param {string} sourceKey - Source identifier
     */
    startDataUpdates(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || this.updateIntervals.has(sourceKey)) return;
        
        const interval = setInterval(async () => {
            await this.updateSourceData(sourceKey);
        }, source.config.UPDATE_INTERVAL);
        
        this.updateIntervals.set(sourceKey, interval);
    }
    
    /**
     * Stop data updates for a source
     * @param {string} sourceKey - Source identifier
     */
    stopDataUpdates(sourceKey) {
        const interval = this.updateIntervals.get(sourceKey);
        if (interval) {
            clearInterval(interval);
            this.updateIntervals.delete(sourceKey);
        }
    }
    
    /**
     * Update data from a specific source
     * @param {string} sourceKey - Source identifier
     */
    async updateSourceData(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source || !this.activeSources.has(sourceKey)) return;
        
        try {
            // Check rate limiting
            if (this.isRateLimited(sourceKey)) {
                console.warn(`Rate limit reached for ${sourceKey}`);
                return;
            }
            
            // Fetch data based on source type
            let data = null;
            switch (sourceKey) {
                case 'flightradar24':
                    data = await this.fetchFlightRadar24Data();
                    break;
                case 'opensky':
                    data = await this.fetchOpenSkyData();
                    break;
                case 'adsb':
                    data = await this.fetchADSBData();
                    break;
                case 'kiwisdr':
                    data = await this.fetchKiwiSDRData();
                    break;
            }
            
            if (data) {
                source.lastData = data;
                this.lastUpdate[sourceKey] = new Date();
                this.cacheData(sourceKey, data);
                
                // Mark as connected if we got valid data
                this.connectionStatus[sourceKey] = 'connected';
                source.status = 'online';
                
                // Dispatch data update event
                window.dispatchEvent(new CustomEvent('dataUpdated', {
                    detail: { source: sourceKey, data: data }
                }));
            }
            
        } catch (error) {
            console.error(`Error updating ${sourceKey} data:`, error);
            source.errorCount++;
            this.connectionStatus[sourceKey] = 'error';
            source.status = 'offline';
            
            // Implement retry logic
            if (source.errorCount < source.config.RETRY_ATTEMPTS) {
                setTimeout(() => {
                    this.updateSourceData(sourceKey);
                }, 5000 * source.errorCount);
            }
        }
    }
    
    /**
     * Fetch data from FlightRadar24
     * @returns {Promise<Object>} Flight data
     */
    async fetchFlightRadar24Data() {
        const config = this.sources.flightradar24.config;
        const url = `${config.BASE_URL}/traffic.js`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseFlightRadar24Data(data);
            
        } catch (error) {
            console.error('FlightRadar24 data fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Fetch data from OpenSky Network
     * @returns {Promise<Object>} Flight data
     */
    async fetchOpenSkyData() {
        const config = this.sources.opensky.config;
        const url = `${config.BASE_URL}/states/all`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseOpenSkyData(data);
            
        } catch (error) {
            console.error('OpenSky data fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Fetch data from ADSB.lol
     * @returns {Promise<Object>} Flight data
     */
    async fetchADSBData() {
        const config = this.sources.adsb.config;
        const url = `${config.BASE_URL}/mil`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseADSBData(data);
            
        } catch (error) {
            console.error('ADSB.lol data fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Fetch data from KiwiSDR
     * @returns {Promise<Object>} Spectrum data
     */
    async fetchKiwiSDRData() {
        const config = this.sources.kiwisdr.config;
        const url = `${config.BASE_URL}/spectrum`;
        
        try {
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseKiwiSDRData(data);
            
        } catch (error) {
            console.error('KiwiSDR data fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Parse FlightRadar24 data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseFlightRadar24Data(rawData) {
        // Implementation depends on actual API response format
        // Placeholder (FR24 often blocked by CORS), return empty set but valid shape
        return {
            source: 'flightradar24',
            timestamp: new Date(),
            flights: [],
            metadata: {
                total: 0,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0,
                unknown: 0
            }
        };
    }
    
    /**
     * Parse OpenSky data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseOpenSkyData(rawData) {
        const flights = [];
        const states = Array.isArray(rawData && rawData.states) ? rawData.states : [];
        
        for (const s of states) {
            // OpenSky state vector indices
            const icao24 = s[0];
            const callsign = (s[1] || '').trim();
            const longitude = s[5];
            const latitude = s[6];
            const baroAltitudeMeters = s[7];
            const velocityMs = s[9];
            const headingDeg = s[10];
            const geoAltitudeMeters = s[13];
            const category = s[17];
            
            if (typeof latitude !== 'number' || typeof longitude !== 'number') continue;
            
            const altitudeMeters = typeof geoAltitudeMeters === 'number' ? geoAltitudeMeters : (typeof baroAltitudeMeters === 'number' ? baroAltitudeMeters : null);
            const altitudeFeet = typeof altitudeMeters === 'number' ? Math.round(altitudeMeters * 3.28084) : null;
            const speedKts = typeof velocityMs === 'number' ? Math.round(velocityMs * 1.94384) : null;
            
            const type = (typeof category === 'number' && category >= 0) ? 'unknown' : 'unknown';
            
            flights.push({
                id: icao24 || callsign || `${latitude},${longitude}`,
                icao24: icao24 || null,
                callsign: callsign || null,
                lat: latitude,
                lon: longitude,
                altitude: altitudeFeet,
                speed: speedKts,
                heading: typeof headingDeg === 'number' ? headingDeg : null,
                type,
                source: 'opensky'
            });
        }
        
        return {
            source: 'opensky',
            timestamp: new Date((rawData && rawData.time) ? rawData.time * 1000 : Date.now()),
            flights,
            metadata: {
                total: flights.length,
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0,
                unknown: flights.length
            }
        };
    }
    
    /**
     * Parse ADSB.lol data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseADSBData(rawData) {
        const flights = [];
        const list = Array.isArray(rawData && rawData.ac) ? rawData.ac : (Array.isArray(rawData && rawData.aircraft) ? rawData.aircraft : []);
        
        for (const a of list) {
            const lat = a.lat ?? a.latitude ?? a.lat_dd;
            const lon = a.lon ?? a.longitude ?? a.lon_dd;
            if (typeof lat !== 'number' || typeof lon !== 'number') continue;
            
            const id = a.hex || a.icao || a.icao24 || a.flight || `${lat},${lon}`;
            const altitudeFeet = typeof a.alt_baro === 'number' ? a.alt_baro : (typeof a.alt_geom === 'number' ? Math.round(a.alt_geom * 3.28084) : null);
            // Ground speed may be in knots already (gs) or m/s (speed)
            const speedKts = typeof a.gs === 'number' ? Math.round(a.gs) : (typeof a.speed === 'number' ? Math.round(a.speed * 1.94384) : null);
            const heading = typeof a.track === 'number' ? a.track : (typeof a.heading === 'number' ? a.heading : null);
            
            flights.push({
                id,
                icao24: a.icao24 || a.hex || null,
                callsign: a.flight || a.call || null,
                lat,
                lon,
                altitude: altitudeFeet,
                speed: speedKts,
                heading,
                type: (a.type || 'military').toLowerCase().includes('mil') ? 'military' : 'unknown',
                source: 'adsb'
            });
        }
        
        return {
            source: 'adsb',
            timestamp: new Date(),
            flights,
            metadata: {
                total: flights.length,
                military: flights.filter(f => f.type === 'military').length,
                commercial: 0,
                private: 0,
                uav: 0,
                unknown: flights.filter(f => f.type === 'unknown').length
            }
        };
    }
    
    /**
     * Parse KiwiSDR data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed spectrum data
     */
    parseKiwiSDRData(rawData) {
        // Implementation depends on actual API response format
        return {
            source: 'kiwisdr',
            timestamp: new Date(),
            spectrum: [],
            metadata: {
                frequencyRange: [0, 30000000],
                resolution: 0,
                samples: 0
            }
        };
    }
    
    /**
     * Make HTTP request with error handling
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise<Response>} Response object
     */
    async makeRequest(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    /**
     * Check if a source is rate limited
     * @param {string} sourceKey - Source identifier
     * @returns {boolean} Rate limit status
     */
    isRateLimited(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return true;
        
        const now = Date.now();
        const counter = this.requestCounters[sourceKey];
        const maxRequests = source.config.MAX_REQUESTS_PER_MINUTE;
        
        // Reset counter if more than a minute has passed
        if (!counter || typeof counter.lastReset !== 'number') {
            this.requestCounters[sourceKey] = { count: 0, lastReset: now };
        }
        const c = this.requestCounters[sourceKey];
        if (now - c.lastReset > 60000) {
            c.count = 0;
            c.lastReset = now;
        }
        
        if (c.count >= maxRequests) {
            return true;
        }
        
        c.count++;
        return false;
    }
    
    /**
     * Cache data for a source
     * @param {string} sourceKey - Source identifier
     * @param {Object} data - Data to cache
     */
    cacheData(sourceKey, data) {
        const cacheKey = `${sourceKey}_${Date.now()}`;
        this.dataCache.set(cacheKey, {
            source: sourceKey,
            data: data,
            timestamp: new Date()
        });
        
        // Clean up old cache entries
        this.cleanupCache();
    }
    
    /**
     * Clean up old cache entries
     */
    cleanupCache() {
        const now = Date.now();
        const maxAge = C4ISR_CONFIG.PERFORMANCE.CACHE_DURATION;
        
        for (const [key, value] of this.dataCache.entries()) {
            if (now - value.timestamp.getTime() > maxAge) {
                this.dataCache.delete(key);
            }
        }
    }
    
    /**
     * Update source status in UI
     */
    updateSourceStatus() {
        Object.keys(this.sources).forEach(sourceKey => {
            const source = this.sources[sourceKey];
            const statusElement = document.querySelector(`#${sourceKey}-source + .source-status`);
            
            if (statusElement) {
                statusElement.className = `source-status ${source.status}`;
            }
            
            // Update checkbox state
            const checkbox = document.getElementById(`${sourceKey}-source`);
            if (checkbox) {
                checkbox.checked = this.activeSources.has(sourceKey);
            }
        });
    }
    
    /**
     * Get active sources
     * @returns {Set} Set of active source keys
     */
    getActiveSources() {
        return new Set(this.activeSources);
    }
    
    /**
     * Get source status
     * @param {string} sourceKey - Source identifier
     * @returns {Object} Source status information
     */
    getSourceStatus(sourceKey) {
        const source = this.sources[sourceKey];
        if (!source) return null;
        
        return {
            name: source.name,
            status: source.status,
            connectionStatus: this.connectionStatus[sourceKey],
            lastUpdate: this.lastUpdate[sourceKey],
            errorCount: source.errorCount,
            isActive: this.activeSources.has(sourceKey)
        };
    }
    
    /**
     * Get all sources status
     * @returns {Object} Status of all sources
     */
    getAllSourcesStatus() {
        const status = {};
        Object.keys(this.sources).forEach(sourceKey => {
            status[sourceKey] = this.getSourceStatus(sourceKey);
        });
        return status;
    }
    
    /**
     * Get cached data for a source
     * @param {string} sourceKey - Source identifier
     * @param {number} maxAge - Maximum age in milliseconds
     * @returns {Object|null} Cached data or null if not found/expired
     */
    getCachedData(sourceKey, maxAge = 300000) {
        const now = Date.now();
        
        for (const [key, value] of this.dataCache.entries()) {
            if (value.source === sourceKey && 
                (now - value.timestamp.getTime()) <= maxAge) {
                return value.data;
            }
        }
        
        return null;
    }
    
    /**
     * Get combined data from all active sources
     * @returns {Object} Combined flight data
     */
    getCombinedData() {
        const combined = {
            timestamp: new Date(),
            totalFlights: 0,
            flights: [],
            sources: {},
            metadata: {
                military: 0,
                commercial: 0,
                private: 0,
                uav: 0,
                unknown: 0
            }
        };
        
        this.activeSources.forEach(sourceKey => {
            const source = this.sources[sourceKey];
            if (source && source.lastData) {
                combined.sources[sourceKey] = {
                    name: source.name,
                    data: source.lastData,
                    lastUpdate: this.lastUpdate[sourceKey]
                };
                
                // Combine flight data
                if (source.lastData.flights) {
                    combined.flights.push(...source.lastData.flights);
                    combined.totalFlights += source.lastData.flights.length;
                }
                
                // Update metadata
                if (source.lastData.metadata) {
                    Object.keys(source.lastData.metadata).forEach(key => {
                        if (combined.metadata[key] !== undefined) {
                            combined.metadata[key] += source.lastData.metadata[key];
                        }
                    });
                }
            }
        });
        
        return combined;
    }
}

// Create global instance
window.dataSourceManager = new DataSourceManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSourceManager;
}