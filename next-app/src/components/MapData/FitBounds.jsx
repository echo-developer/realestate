import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;

    map.fitBounds(markers, { padding: [50, 50] });
  }, [markers, map]);

  return null;
};

export default FitBounds;
