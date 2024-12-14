import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AllTripsMap = ({ trips }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const customIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'), // nebo použijte vlastní cestu k obrázku
    iconSize: [25, 41], // Velikost ikony
    iconAnchor: [12, 41], // Ukotvení ikony
    popupAnchor: [1, -34], // Posun popupu vzhledem k ikoně
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Stín markeru
    shadowSize: [41, 41], // Velikost stínu
  });

  useEffect(() => {
    if (!mapRef.current) {
      // Inicializace mapy
      mapRef.current = L.map(mapContainerRef.current).setView([50.0755, 14.4378], 5);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    // Vyčištění a překreslení markerů a polygonů
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon) {
        mapRef.current.removeLayer(layer);
      }
    });

    const latLngs = []; // Pole pro uchování souřadnic všech tripů pro fitBounds

    let initialViewSet = false;
    trips.forEach((trip) => {
      let hueRotation = Math.floor(Math.random() * 360);

      trip.subtrips.forEach((subtrip, index) => {
        // Nastavení inicializačního pohledu
        if (!initialViewSet && subtrip.gps) {
          mapRef.current.setView(subtrip.gps, 5); // Nastavení počátečního pohledu na první GPS
          initialViewSet = true;
        }

        // Přidání markeru
        const marker = L.marker(subtrip.gps, { icon: customIcon }).addTo(mapRef.current);
        latLngs.push(subtrip.gps); // Přidání souřadnic do pole pro fitBounds

        // Přidání pop-upu
        marker.bindPopup(
          `<a href='/trip/${trip.id}' class='text-lg'><b>${trip.name}</b></a><br>
          <a class='text-lg'>${subtrip.name}</a>`
        );

        // Klikací akce na marker
        marker.on('click', (e) => {
          const popup = e.target.getPopup();
          const content = popup.getContent();
          console.log('Popup Content:', content);
        });

        // Přidání čar mezi body
        if (index < trip.subtrips.length - 1) {
          const nextGps = trip.subtrips[index + 1].gps;
          L.polygon([subtrip.gps, nextGps]).addTo(mapRef.current);  // Přidání polygonu přímo na mapu
          latLngs.push(nextGps); // Přidání souřadnic pro fitBounds
        }
      });
    });

    // Automatické přizpůsobení mapy tak, aby zobrazovala všechny markery a polygon
    if (latLngs.length > 0) {
      mapRef.current.fitBounds(latLngs); // Nastavení bounds na všechny souřadnice
    }

    // Upraví velikost mapy při změně okna
    mapRef.current.invalidateSize();

    return () => {
      mapRef.current.off(); // Odstraní všechny event listenery
    };
  }, [trips]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '80vh', marginTop: '1rem', borderRadius: '16px' }}
    ></div>
  );
};

export default AllTripsMap;
