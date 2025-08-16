/**
 * C4ISR Map Controller
 * Placeholder implementation - to be fully developed
 */

class MapController {
    constructor() {
        this.isInitialized = false;
        this.map = null;
        this.isActive = false;
        this.tileLayers = {};
        this.currentBaseLayer = null;
        this.flightMarkersById = new Map();
        this.markerLayer = null;
        this.lastRenderTs = 0;
        this.renderThrottleMs = 1000; // redraw at most once per second
        this.filters = {
            altitudeMin: null,
            altitudeMax: null,
            speedMin: null,
            speedMax: null,
            type: 'all',
            threat: 'all'
        };
    }
    
    async initialize() {
        try {
            const center = C4ISR_CONFIG.MAP.DEFAULT_CENTER;
            const zoom = C4ISR_CONFIG.MAP.DEFAULT_ZOOM;
            
            this.map = L.map('2d-map', {
                worldCopyJump: true
            }).setView(center, zoom);
            
            // Base layers
            this.tileLayers.osm = L.tileLayer(
                C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.url,
                { attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.attribution }
            );
            this.tileLayers.satellite = L.tileLayer(
                C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.url,
                { attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.attribution }
            );
            this.tileLayers.terrain = L.tileLayer(
                C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.url,
                { attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.attribution }
            );
            
            this.currentBaseLayer = this.tileLayers.osm.addTo(this.map);
            
            // Marker layer
            this.markerLayer = L.layerGroup().addTo(this.map);
            
            // Zoom change forwarding
            this.map.on('zoomend', () => {
                const zoom = this.map.getZoom();
                window.dispatchEvent(new CustomEvent('zoomChanged', { detail: { zoom } }));
            });
            
            // Listen for data updates to render flights
            window.addEventListener('dataUpdated', () => {
                if (this.isActive) this.requestRender();
            });
            
            this.isInitialized = true;
            return true;
        } catch (e) {
            console.error('Map init failed:', e);
            this.isInitialized = false;
            return false;
        }
    }
    
    activate() {
        this.isActive = true;
        this.requestRender();
    }
    
    deactivate() {
        this.isActive = false;
    }
    
    requestRender() {
        const now = Date.now();
        if (now - this.lastRenderTs < this.renderThrottleMs) return;
        this.lastRenderTs = now;
        this.renderFlights();
    }
    
    renderFlights() {
        if (!this.map || !window.dataSourceManager) return;
        const combined = window.dataSourceManager.getCombinedData();
        const flights = this.applyFilters(combined.flights);
        
        // Build a set of IDs to keep
        const idsToKeep = new Set();
        const maxDisplay = C4ISR_CONFIG.MAP.MAX_FLIGHTS_DISPLAY;
        const toRender = flights.slice(0, maxDisplay);
        
        for (const f of toRender) {
            if (!isFinite(f.lat) || !isFinite(f.lon)) continue;
            const id = f.id || `${f.lat},${f.lon}`;
            idsToKeep.add(id);
            
            let marker = this.flightMarkersById.get(id);
            if (!marker) {
                marker = this.createOrUpdateMarker(null, f);
                this.flightMarkersById.set(id, marker);
                marker.addTo(this.markerLayer);
            } else {
                this.createOrUpdateMarker(marker, f);
            }
        }
        
        // Remove stale markers
        for (const [id, marker] of this.flightMarkersById.entries()) {
            if (!idsToKeep.has(id)) {
                this.markerLayer.removeLayer(marker);
                this.flightMarkersById.delete(id);
            }
        }
        
        // Update total flights text in map overlay (optional if app updates it elsewhere)
        const flightCount = document.getElementById('flight-count');
        if (flightCount) {
            flightCount.textContent = `${flights.length} Flights`;
            flightCount.setAttribute('data-count', flights.length);
        }
    }
    
    createOrUpdateMarker(existingMarker, flight) {
        const icon = this.getIconForFlight(flight);
        const latlng = [flight.lat, flight.lon];
        const rotation = typeof flight.heading === 'number' ? flight.heading : 0;
        const popupHtml = this.getPopupHtml(flight);
        
        if (!existingMarker) {
            const marker = L.marker(latlng, { icon });
            marker.bindPopup(popupHtml);
            marker.on('click', () => {
                window.dispatchEvent(new CustomEvent('flightSelected', { detail: { flight } }));
            });
            // Apply rotation via CSS transform on icon if available
            marker.on('add', () => {
                const el = marker.getElement();
                if (el) el.style.transform += ` rotate(${rotation}deg)`;
            });
            return marker;
        } else {
            existingMarker.setLatLng(latlng);
            existingMarker.setIcon(icon);
            existingMarker.setPopupContent(popupHtml);
            const el = existingMarker.getElement();
            if (el) el.style.transform = `translate3d(0,0,0) rotate(${rotation}deg)`;
            return existingMarker;
        }
    }
    
    getIconForFlight(flight) {
        const type = (flight.type || 'unknown').toLowerCase();
        const cfg = C4ISR_CONFIG.MAP.FLIGHT_ICONS;
        let color = cfg.UNKNOWN.color;
        let size = cfg.UNKNOWN.size;
        if (type === 'military') { color = cfg.MILITARY.color; size = cfg.MILITARY.size; }
        else if (type === 'commercial') { color = cfg.COMMERCIAL.color; size = cfg.COMMERCIAL.size; }
        else if (type === 'private') { color = cfg.PRIVATE.color; size = cfg.PRIVATE.size; }
        else if (type === 'uav' || type === 'drone') { color = cfg.UAV.color; size = cfg.UAV.size; }
        
        const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[1]}" viewBox="0 0 24 24" fill="${color}"><path d="M2 16l10-5 10 5-10 6-10-6zm10-8l10 5-10 5-10-5 10-5z"/></svg>`;
        const url = `data:image/svg+xml;base64,${btoa(svg)}`;
        return L.icon({ iconUrl: url, iconSize: size, iconAnchor: [size[0] / 2, size[1] / 2] });
    }
    
    getPopupHtml(f) {
        return `
            <div>
                <div><strong>${f.callsign || f.icao24 || f.id || 'Unknown'}</strong></div>
                <div>Type: ${f.type || 'unknown'}</div>
                <div>Alt: ${isFinite(f.altitude) ? f.altitude + ' ft' : 'n/a'}</div>
                <div>Speed: ${isFinite(f.speed) ? f.speed + ' kts' : 'n/a'}</div>
                <div>Heading: ${isFinite(f.heading) ? f.heading + '°' : 'n/a'}</div>
            </div>
        `;
    }
    
    toggleLayer(layerName, enabled) {
        if (!this.map) return;
        if (layerName === 'satellite') {
            if (enabled) {
                this.map.removeLayer(this.currentBaseLayer);
                this.currentBaseLayer = this.tileLayers.satellite.addTo(this.map);
            } else {
                if (this.currentBaseLayer === this.tileLayers.satellite) {
                    this.map.removeLayer(this.currentBaseLayer);
                    this.currentBaseLayer = this.tileLayers.osm.addTo(this.map);
                }
            }
        } else if (layerName === 'terrain') {
            if (enabled) {
                this.map.removeLayer(this.currentBaseLayer);
                this.currentBaseLayer = this.tileLayers.terrain.addTo(this.map);
            } else {
                if (this.currentBaseLayer === this.tileLayers.terrain) {
                    this.map.removeLayer(this.currentBaseLayer);
                    this.currentBaseLayer = this.tileLayers.osm.addTo(this.map);
                }
            }
        } else if (layerName === 'contrast' || layerName === 'weather') {
            // Not implemented overlays — placeholder for future
            console.log(`Layer ${layerName} ${enabled ? 'enabled' : 'disabled'}`);
        }
    }
    
    applyAltitudeFilter(min, max) {
        const nMin = min !== '' ? Number(min) : null;
        const nMax = max !== '' ? Number(max) : null;
        this.filters.altitudeMin = isFinite(nMin) ? nMin : null;
        this.filters.altitudeMax = isFinite(nMax) ? nMax : null;
        this.requestRender();
    }
    
    applySpeedFilter(min, max) {
        const nMin = min !== '' ? Number(min) : null;
        const nMax = max !== '' ? Number(max) : null;
        this.filters.speedMin = isFinite(nMin) ? nMin : null;
        this.filters.speedMax = isFinite(nMax) ? nMax : null;
        this.requestRender();
    }
    
    applyAircraftTypeFilter(type) {
        this.filters.type = type || 'all';
        this.requestRender();
    }
    
    applyThreatFilter(level) {
        this.filters.threat = level || 'all';
        this.requestRender();
    }
    
    applyFilters(flights) {
        return flights.filter(f => {
            if (!isFinite(f.lat) || !isFinite(f.lon)) return false;
            if (this.filters.type !== 'all') {
                const t = (f.type || 'unknown').toLowerCase();
                if (t !== this.filters.type) return false;
            }
            if (isFinite(this.filters.altitudeMin) && isFinite(f.altitude) && f.altitude < this.filters.altitudeMin) return false;
            if (isFinite(this.filters.altitudeMax) && isFinite(f.altitude) && f.altitude > this.filters.altitudeMax) return false;
            if (isFinite(this.filters.speedMin) && isFinite(f.speed) && f.speed < this.filters.speedMin) return false;
            if (isFinite(this.filters.speedMax) && isFinite(f.speed) && f.speed > this.filters.speedMax) return false;
            // no threat filtering yet
            return true;
        });
    }
    
    zoomIn() {
        if (!this.map) return;
        this.map.zoomIn();
    }
    
    zoomOut() {
        if (!this.map) return;
        this.map.zoomOut();
    }
    
    resetView() {
        if (!this.map) return;
        this.map.setView(C4ISR_CONFIG.MAP.DEFAULT_CENTER, C4ISR_CONFIG.MAP.DEFAULT_ZOOM);
    }
    
    isHealthy() {
        return !!this.map;
    }
    
    shutdown() {
        this.isInitialized = false;
        this.isActive = false;
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
        this.map = null;
        this.flightMarkersById.clear();
    }
}

// Create global instance
window.mapController = new MapController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapController;
}