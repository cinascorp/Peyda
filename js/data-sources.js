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
        this._didInitialActivation = false;
        
        this.initializeSources();
        this.setupEventListeners();
        this.startMonitoring();
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
        this.performInitialActivationIfReady();
    }
    
    /**
     * Activate checked, online sources once during startup
     */
    performInitialActivationIfReady() {
        if (this._didInitialActivation) return;
        Object.keys(this.sources).forEach(sourceKey => {
            const checkbox = document.getElementById(`${sourceKey}-source`);
            if (checkbox && checkbox.checked) {
                this.activateSource(sourceKey);
            }
        });
        this._didInitialActivation = true;
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
                    testUrl = `${config.BASE_URL}/states/all?time=0&icao24=abc123`;
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
                method: 'GET',
                headers: { 'Accept': 'application/json' }
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
        
        // Proceed with activation even if status is offline; data fetch will handle errors/CORS
        this.activeSources.add(sourceKey);
        this.startDataUpdates(sourceKey);
        
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
        
        // Kick off an immediate fetch for faster first render
        this.updateSourceData(sourceKey).catch(() => {});
        
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
                
                // Dispatch data update event
                window.dispatchEvent(new CustomEvent('dataUpdated', {
                    detail: { source: sourceKey, data: data }
                }));
            }
            
        } catch (error) {
            console.error(`Error updating ${sourceKey} data:`, error);
            source.errorCount++;
            
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
            const headers = {
                'User-Agent': 'C4ISR-Military-Tracker/2.0.0'
            };
            // Optional: add basic auth if configured via global ENV-like variables
            if (config.AUTH && config.AUTH.BASIC && config.AUTH.BASIC.USER && config.AUTH.BASIC.PASS) {
                const token = btoa(`${config.AUTH.BASIC.USER}:${config.AUTH.BASIC.PASS}`);
                headers['Authorization'] = `Basic ${token}`;
            }
            
            const response = await this.makeRequest(url, {
                method: 'GET',
                headers
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
        // FR24 is commonly CORS-restricted. Leave as no-op until proxy is used.
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
        const states = Array.isArray(rawData?.states) ? rawData.states : [];
        const flights = [];
        const metadata = { total: 0, military: 0, commercial: 0, private: 0, uav: 0, unknown: 0 };
        
        for (const s of states) {
            // OpenSky state vector indices per API docs
            const icao24 = s[0] || '';
            const callsign = (s[1] || '').trim();
            const originCountry = s[2] || '';
            const longitude = s[5];
            const latitude = s[6];
            const baroAltitudeMeters = s[7];
            const velocityMs = s[9];
            const trueTrackDeg = s[10];
            const geoAltitudeMeters = s[13];
            
            if (typeof latitude !== 'number' || typeof longitude !== 'number') continue;
            const altitudeMeters = (typeof geoAltitudeMeters === 'number') ? geoAltitudeMeters : baroAltitudeMeters;
            const altitudeFeet = (typeof altitudeMeters === 'number') ? Math.round(altitudeMeters * 3.28084) : null;
            const speedKts = (typeof velocityMs === 'number') ? Math.round(velocityMs * 1.94384) : null;
            const heading = (typeof trueTrackDeg === 'number') ? Math.round(trueTrackDeg) : null;
            
            // Heuristic type detection is limited without extra data
            const type = 'unknown';
            metadata.unknown++;
            
            flights.push({
                id: `opensky_${icao24 || callsign || Math.random().toString(36).slice(2)}`,
                source: 'opensky',
                icao24,
                callsign,
                origin_country: originCountry,
                coordinates: { lat: latitude, lng: longitude },
                altitude: altitudeFeet,
                speed: speedKts,
                heading,
                aircraft_type: type,
                raw: s
            });
        }
        metadata.total = flights.length;
        
        return {
            source: 'opensky',
            timestamp: new Date(),
            flights,
            metadata
        };
    }
    
    /**
     * Parse ADSB.lol data
     * @param {Object} rawData - Raw data from API
     * @returns {Object} Parsed flight data
     */
    parseADSBData(rawData) {
        const acList = Array.isArray(rawData?.ac) ? rawData.ac : (Array.isArray(rawData) ? rawData : []);
        const flights = [];
        const metadata = { total: 0, military: 0, commercial: 0, private: 0, uav: 0, unknown: 0 };
        
        for (const ac of acList) {
            const hex = ac.hex || ac.icao || ac.icao24 || '';
            const callsign = (ac.flight || ac.callsign || '').trim();
            const lat = ac.lat ?? ac.latitude;
            const lon = ac.lon ?? ac.lng ?? ac.longitude;
            const altBaro = ac.alt_baro ?? ac.alt_baro_ft ?? ac.baro_altitude;
            const gs = ac.gs ?? ac.speed_kts ?? ac.vel ?? ac.velocity_kts;
            const track = ac.track ?? ac.heading ?? ac.true_track;
            
            if (typeof lat !== 'number' || typeof lon !== 'number') continue;
            const altitudeFeet = (typeof altBaro === 'number') ? Math.round(altBaro) : null;
            const speedKts = (typeof gs === 'number') ? Math.round(gs) : null;
            const heading = (typeof track === 'number') ? Math.round(track) : null;
            
            const type = 'military';
            metadata.military++;
            
            flights.push({
                id: `adsb_${hex || callsign || Math.random().toString(36).slice(2)}`,
                source: 'adsb',
                icao24: hex,
                callsign,
                coordinates: { lat, lng: lon },
                altitude: altitudeFeet,
                speed: speedKts,
                heading,
                aircraft_type: type,
                raw: ac
            });
        }
        metadata.total = flights.length;
        
        return {
            source: 'adsb',
            timestamp: new Date(),
            flights,
            metadata
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
        if (now - counter.lastReset > 60000) {
            counter.count = 0;
            counter.lastReset = now;
        }
        
        if (counter.count >= maxRequests) {
            return true;
        }
        
        counter.count++;
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
                
                if (source.lastData.flights) {
                    combined.flights.push(...source.lastData.flights);
                    combined.totalFlights += source.lastData.flights.length;
                }
                
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