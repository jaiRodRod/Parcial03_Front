import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { formatDateTime } from "../CommonOperations";

function LeafletControlGeocoder() {
    const map = useMap();
  
    const generateMarkerIcon = (color) => {
        return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
    };

    const yellowMarkerIcon = generateMarkerIcon("yellow");

    useEffect(() => {
      var geocoder = L.Control.Geocoder.nominatim();
      if (typeof URLSearchParams !== "undefined" && location.search) {
        // parse /?geocoder=nominatim from URL
        var params = new URLSearchParams(location.search);
        var geocoderString = params.get("geocoder");
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
          geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
          console.warn("Unsupported geocoder", geocoderString);
        }
      }
  
      L.Control.geocoder({
        query: "",
        placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder
      })
        .on("markgeocode", function (e) {
          var latlng = e.geocode.center;
          L.marker(latlng, { icon: yellowMarkerIcon })
            .addTo(map)
            .bindPopup(e.geocode.name)
            .openPopup();
          map.fitBounds(e.geocode.bbox);
        })
        .addTo(map);
    }, []);
  
    return null;
}

function UpdateMap({ onMapClick }) {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();

        // Registrar evento click
        map.on("click", onMapClick);

        // Limpiar el evento al desmontar
        return () => {
            map.off("click", onMapClick);
        };
    }, [map, onMapClick]);

    return null;
}

function CustomMap({ lat, lng, markers, zoom = 6, setNewMarker, wiper }) {
    const center = [lat, lng];
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);

    const generateMarkerIcon = (color) => {
        return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
    };

    const redMarkerIcon = generateMarkerIcon("red");
    const blueMarkerIcon = generateMarkerIcon("blue");
    const greenMarkerIcon = generateMarkerIcon("green");

    const handleMapClick = (event) => {
        //const map = event.target; // Referencia al mapa
        setMap(event.target);
        const { lat, lng } = event.latlng;

        // Si ya existe un marcador, eliminarlo
        if (markerRef.current) {
            map.removeLayer(markerRef.current);
        }

        // Crear y añadir un nuevo marcador
        const newMarker = L.marker([lat, lng], { icon: greenMarkerIcon }).addTo(map);
        markerRef.current = newMarker;
        setNewMarker([lat,lng]);
    };

    useEffect(() => {
        if(map && markerRef.current) {
            map.removeLayer(markerRef.current);
        }
    },[wiper])

    return (
        <div className="relative w-[80vw] h-[80vh] mx-auto py-5 rounded-lg shadow-md overflow-hidden">
            <MapContainer
                center={center}
                zoom={zoom}
                className="absolute top-0 left-0 w-full h-full"
                whenReady={(map) => map.target.invalidateSize()}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map((marker) => (
                    <Marker
                        key={marker.key}
                        position={marker.position}
                        icon={marker.color === "me" ? redMarkerIcon : blueMarkerIcon}
                    >
                        {marker.color === "me" ? (
                            <Popup>
                                {marker.children}
                            </Popup>
                        ) : (
                            <Popup>
                                {marker.children.url ? (
                                    <div dangerouslySetInnerHTML={{
                                        __html: `
                                        Nombre del item: ${marker.children.nombre} <br />
                                        Fecha: ${formatDateTime(marker.children.fecha)} <br />
                                        Email del creador: ${marker.children.email} <br />
                                        Imagen asociada: <br/>
                                        <a href="${marker.children.url}" target="_blank"><img src=${marker.children.url} alt="user image"/></a>
                                        `,
                                    }} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{
                                        __html: `
                                        Nombre del item: ${marker.children.nombre} <br />
                                        Fecha: ${formatDateTime(marker.children.fecha)} <br />
                                        Email del creador: ${marker.children.email}
                                        `,
                                    }} />
                                )}
                                
                            </Popup>
                        )}
                    </Marker>
                ))}
                <UpdateMap onMapClick={handleMapClick} />
                {/*<LeafletControlGeocoder/>*/}
            </MapContainer>
        </div>
    );
}

export default CustomMap;
