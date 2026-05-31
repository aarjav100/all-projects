import { useEffect, useRef } from "react";
import L from "leaflet";
import { detectCurrencyAt, type LatLng } from "@/lib/geo";

type Props = {
  center?: LatLng;
  zoom?: number;
  onLocationSelected?: (args: { latlng: LatLng; currency?: string; country?: string }) => void;
};

const defaultCenter: LatLng = { lat: 20, lng: 0 };

const MapPicker = ({ center = defaultCenter, zoom = 3, onLocationSelected }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView([center.lat, center.lng], zoom);
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const setMarker = (latlng: LatLng) => {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([latlng.lat, latlng.lng]).addTo(map);
    };

    const handleSelect = async (latlngLeaflet: L.LatLng) => {
      const latlng: LatLng = { lat: latlngLeaflet.lat, lng: latlngLeaflet.lng };
      setMarker(latlng);
      try {
        const { currency, meta } = await detectCurrencyAt(latlng);
        onLocationSelected?.({ latlng, currency, country: meta.country });
      } catch {
        onLocationSelected?.({ latlng, currency: undefined, country: undefined });
      }
    };

    map.on("click", (e: L.LeafletMouseEvent) => handleSelect(e.latlng));

    return () => {
      map.off();
      map.remove();
    };
  }, [center.lat, center.lng, zoom, onLocationSelected]);

  return <div ref={containerRef} style={{ width: "100%", height: 400, borderRadius: 8, overflow: "hidden" }} />;
};

export default MapPicker;


