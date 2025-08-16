/**
 * C4ISR Map Controller
 * Leaflet-based implementation for 2D map rendering and live updates
 */

class MapController {
	constructor() {
		this.isInitialized = false;
		this.map = null;
		this.isActive = false;
		this.baseLayers = {};
		this.currentBaseLayer = null;
		this.flightIdToMarker = new Map();
		this.displayedFlightIds = new Set();
		this.filters = {
			altitude: [null, null],
			speed: [null, null],
			type: 'all',
			threat: 'all'
		};
	}
	
	async initialize() {
		if (this.isInitialized) return true;
		const mapElement = document.getElementById('2d-map');
		if (!mapElement) return false;
		
		// Initialize Leaflet map
		this.map = L.map(mapElement, {
			zoomControl: false,
			minZoom: C4ISR_CONFIG.MAP.MIN_ZOOM,
			maxZoom: C4ISR_CONFIG.MAP.MAX_ZOOM,
			preferCanvas: true
		}).setView(C4ISR_CONFIG.MAP.DEFAULT_CENTER, C4ISR_CONFIG.MAP.DEFAULT_ZOOM);
		
		// Base layers
		this.baseLayers.osm = L.tileLayer(C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.url, {
			attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.OPENSTREETMAP.attribution
		}).addTo(this.map);
		this.currentBaseLayer = this.baseLayers.osm;
		
		this.baseLayers.satellite = L.tileLayer(C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.url, {
			attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.SATELLITE.attribution
		});
		this.baseLayers.terrain = L.tileLayer(C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.url, {
			attribution: C4ISR_CONFIG.MAP.TILE_LAYERS.TERRAIN.attribution
		});
		
		// Event: report zoom changes
		this.map.on('zoomend', () => {
			const zoom = this.map.getZoom();
			if (window.c4isrApp) {
				window.c4isrApp.dispatchEvent('zoomChanged', { zoom });
			}
		});
		
		// Listen to data updates
		window.addEventListener('dataUpdated', (e) => {
			this.renderCombinedFlights();
		});
		
		this.isInitialized = true;
		return true;
	}
	
	activate() {
		this.isActive = true;
	}
	
	deactivate() {
		this.isActive = false;
	}
	
	toggleLayer(layerName, enabled) {
		if (!this.map) return;
		switch (layerName) {
			case 'satellite':
				this._setBaseLayer(enabled ? this.baseLayers.satellite : this.baseLayers.osm);
				break;
			case 'contrast':
				// Use OSM for contrast as placeholder
				this._setBaseLayer(this.baseLayers.osm);
				break;
			case 'terrain':
				this._setBaseLayer(enabled ? this.baseLayers.terrain : this.baseLayers.osm);
				break;
			case 'weather':
				// Weather overlay not implemented in this scope
				break;
		}
	}
	
	applyAltitudeFilter(min, max) {
		const minVal = min ? parseInt(min, 10) : null;
		const maxVal = max ? parseInt(max, 10) : null;
		this.filters.altitude = [isNaN(minVal) ? null : minVal, isNaN(maxVal) ? null : maxVal];
		this.renderCombinedFlights();
	}
	
	applySpeedFilter(min, max) {
		const minVal = min ? parseInt(min, 10) : null;
		const maxVal = max ? parseInt(max, 10) : null;
		this.filters.speed = [isNaN(minVal) ? null : minVal, isNaN(maxVal) ? null : maxVal];
		this.renderCombinedFlights();
	}
	
	applyAircraftTypeFilter(type) {
		this.filters.type = type || 'all';
		this.renderCombinedFlights();
	}
	
	applyThreatFilter(level) {
		this.filters.threat = level || 'all';
		this.renderCombinedFlights();
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
		this.flightIdToMarker.clear();
	}
	
	_setBaseLayer(layer) {
		if (!layer || layer === this.currentBaseLayer) return;
		this.map.removeLayer(this.currentBaseLayer);
		layer.addTo(this.map);
		this.currentBaseLayer = layer;
	}
	
	renderCombinedFlights() {
		if (!this.map) return;
		const combined = window.dataSourceManager?.getCombinedData?.();
		if (!combined) return;
		
		const maxToDisplay = C4ISR_CONFIG.MAP.MAX_FLIGHTS_DISPLAY;
		let flights = Array.isArray(combined.flights) ? combined.flights : [];
		
		// Apply filters
		flights = flights.filter(f => this._passesFilters(f));
		
		// Cap for performance
		if (flights.length > maxToDisplay) {
			flights = flights.slice(0, maxToDisplay);
		}
		
		const nextDisplayed = new Set();
		for (const flight of flights) {
			if (!flight?.coordinates) continue;
			const id = flight.id;
			nextDisplayed.add(id);
			const latlng = [flight.coordinates.lat, flight.coordinates.lng];
			
			if (this.flightIdToMarker.has(id)) {
				const marker = this.flightIdToMarker.get(id);
				marker.setLatLng(latlng);
				marker.setPopupContent(this._getPopupHtml(flight));
			} else {
				const icon = this._createIconForFlight(flight);
				const marker = L.marker(latlng, { icon });
				marker.bindPopup(this._getPopupHtml(flight));
				marker.on('click', () => {
					if (window.c4isrApp) {
						window.c4isrApp.dispatchEvent('flightSelected', { flight });
					}
				});
				marker.addTo(this.map);
				this.flightIdToMarker.set(id, marker);
			}
		}
		
		// Remove markers that are no longer present
		for (const [id, marker] of this.flightIdToMarker.entries()) {
			if (!nextDisplayed.has(id)) {
				this.map.removeLayer(marker);
				this.flightIdToMarker.delete(id);
			}
		}
	}
	
	_passesFilters(f) {
		const [altMin, altMax] = this.filters.altitude;
		if (altMin !== null && typeof f.altitude === 'number' && f.altitude < altMin) return false;
		if (altMax !== null && typeof f.altitude === 'number' && f.altitude > altMax) return false;
		
		const [spdMin, spdMax] = this.filters.speed;
		if (spdMin !== null && typeof f.speed === 'number' && f.speed < spdMin) return false;
		if (spdMax !== null && typeof f.speed === 'number' && f.speed > spdMax) return false;
		
		if (this.filters.type && this.filters.type !== 'all') {
			const t = (f.aircraft_type || 'unknown').toLowerCase();
			if (this.filters.type === 'military' && t !== 'military') return false;
			if (this.filters.type === 'commercial' && t !== 'commercial') return false;
			if (this.filters.type === 'private' && t !== 'private') return false;
			if (this.filters.type === 'uav' && !(t === 'uav' || t === 'drone')) return false;
		}
		
		return true;
	}
	
	_createIconForFlight(f) {
		const type = (f.aircraft_type || 'unknown').toUpperCase();
		let color = '#888888';
		if (type === 'MILITARY') color = C4ISR_CONFIG.MAP.FLIGHT_ICONS.MILITARY.color;
		else if (type === 'COMMERCIAL') color = C4ISR_CONFIG.MAP.FLIGHT_ICONS.COMMERCIAL.color;
		else if (type === 'PRIVATE') color = C4ISR_CONFIG.MAP.FLIGHT_ICONS.PRIVATE.color;
		else if (type === 'UAV' || type === 'DRONE') color = C4ISR_CONFIG.MAP.FLIGHT_ICONS.UAV.color;
		
		// Simple SVG plane icon pointing up; rotationAngle will rotate it
		const svg = encodeURIComponent(`
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
				<path fill='${color}' d='M12 2l2.5 7H22l-7 5 2.5 8L12 17l-5.5 5 2.5-8-7-5h7.5z'/>
			</svg>
		`);
		return L.icon({
			iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
			iconSize: [24, 24],
			iconAnchor: [12, 12]
		});
	}
	
	_getPopupHtml(f) {
		const id = f.id || 'N/A';
		const cs = f.callsign || '—';
		const alt = (typeof f.altitude === 'number') ? `${f.altitude} ft` : '—';
		const spd = (typeof f.speed === 'number') ? `${f.speed} kts` : '—';
		const hdg = (typeof f.heading === 'number') ? `${f.heading}°` : '—';
		const src = f.source || '—';
		return `
			<div class="flight-popup">
				<div><strong>ID:</strong> ${id}</div>
				<div><strong>Callsign:</strong> ${cs}</div>
				<div><strong>Altitude:</strong> ${alt}</div>
				<div><strong>Speed:</strong> ${spd}</div>
				<div><strong>Heading:</strong> ${hdg}</div>
				<div><strong>Source:</strong> ${src}</div>
			</div>
		`;
	}
}

// Create global instance
window.mapController = new MapController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
	module.exports = MapController;
}