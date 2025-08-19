import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue with Next.js by creating a simple colored circle marker
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

// Create a simple colored circle marker
const createSimpleMarker = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<div style="width: 20px; height: 20px; background-color: #3B82F6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Override the default icon creation
L.Marker.prototype.options.icon = createSimpleMarker();
