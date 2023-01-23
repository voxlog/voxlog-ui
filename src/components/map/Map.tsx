import { useEffect, useState } from 'react';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './styles/Map.module.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const { MapContainer } = ReactLeaflet;
// move controller to bottom left
const Map = ({ setCenter, className, center, shouldUpdate = true }: any) => {
  let mapClassName = styles.map;

  useEffect(() => {
    (async function init() {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
      });
    })();
  }, []);

  function LocationMarker() {
    const [position, setPosition] = useState(center);

    const map = ReactLeaflet.useMapEvents({
      click() {
        if (!shouldUpdate) return;
        // @ts-ignore
        const position = map.mouseEventToLatLng(event);
        setPosition(position);
        setCenter(position);
      },
    });

    return <ReactLeaflet.Marker position={position} icon={new L.Icon.Default()} />;
  }

  return (
    <MapContainer className={mapClassName} center={center} zoom={5} scrollWheelZoom={true}>
      <ReactLeaflet.TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
