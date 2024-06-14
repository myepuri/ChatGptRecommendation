import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getRealTimeRecommendations } from "../services/postsService";
import moment from "moment";

const MapView = () => {
  const mapRef = useRef();
  const lat = localStorage.getItem("lat") || 41.8486;
  const long = localStorage.getItem("long") || -87.6288;
  const position = [lat, long]; // Chicago's latitude and longitude
  const zoom = 11;
  const [locations, setLocations] = useState([]);
  const currentDay = moment().format("dddd").toLowerCase();
  const [loading, setLoading] = useState(true);

  function generateIcon(color) {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let results = await getRealTimeRecommendations();
        results = results.filter(
          (location) => location && location?.lat !== "Not Available"
        );
        results = [
          ...results,
          { title: "My Location", color: "green", lat, long },
        ];
        console.log(results);
        setLocations(results);
      } catch (error) {
        console.log(error);
        if (error.response.status == 400) {
          window.alert(
            error.message +
              ". Please generate recommendations first by navigating to /recommedations"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading || locations.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations &&
        locations?.map((location, idx) => {
          return (
            <Marker
              position={[parseFloat(location?.lat), parseFloat(location?.long)]}
              icon={generateIcon(location?.color)}
              key={idx}
            >
              <Popup>
                <h4>{location?.title}</h4>
                <p>{location?.description}</p>
                <p>{location?.address}</p>
                {typeof location?.hours === "string" && (
                  <p>{location?.hours}</p>
                )}
                {typeof location?.hours === "object" &&
                  Object.entries(location?.hours)
                    .map(([day, { opens, closes }]) => {
                      if (day === currentDay) {
                        return (
                          <p key={day}>
                            Opens: {opens} Closes: {closes}
                          </p>
                        );
                      }
                      return null;
                    })
                    .filter(Boolean)}
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default MapView;
