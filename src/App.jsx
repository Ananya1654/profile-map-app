import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css"; // for loading indicators and basic styling

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    photo: "",
    description: "",
    address: "",
    coordinates: "",
    details: ""
  });

  useEffect(() => {
    const initialProfiles = [
      {
        id: 1,
        name: "Ananya",
        photo: "/images/Ananya.jpg",
        description: "Software Developer from Ahmedabad",
        address: "Ahmedabad, Gujarat",
        coordinates: [23.0225, 72.5714],
        details: "Loves coding, hiking, and pizza."
      },
      {
        id: 2,
        name: "Aarushi",
        photo: "/images/Aarushi.jpeg",
        description: "Graphic Designer from Bhuj",
        address: "Bhuj, Gujarat",
        coordinates: [23.253, 69.6699],
        details: "Enjoys painting and photography."
      }
    ];
    setProfiles(initialProfiles);
    setFilteredProfiles(initialProfiles);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProfile = () => {
    const coords = form.coordinates.split(",").map(Number);
    const newProfile = {
      id: Date.now(),
      name: form.name,
      photo: form.photo,
      description: form.description,
      address: form.address,
      coordinates: coords,
      details: form.details
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setFilteredProfiles(updatedProfiles);
    setForm({ name: "", photo: "", description: "", address: "", coordinates: "", details: "" });
  };

  const handleDelete = (id) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    setFilteredProfiles(updated);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = profiles.filter(p => p.name.toLowerCase().includes(value.toLowerCase()) || p.address.toLowerCase().includes(value.toLowerCase()));
    setFilteredProfiles(filtered);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => setIsAdmin(!isAdmin)} style={{ marginBottom: '1rem' }}>
        Switch to {isAdmin ? "User View" : "Admin Panel"}
      </button>

      {isAdmin ? (
        <div>
          <h2>Add New Profile</h2>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br />
          <input name="photo" placeholder="Photo URL" value={form.photo} onChange={handleChange} /><br />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} /><br />
          <input name="coordinates" placeholder="Coordinates (lat,lng)" value={form.coordinates} onChange={handleChange} /><br />
          <input name="details" placeholder="Details" value={form.details} onChange={handleChange} /><br />
          <button onClick={handleAddProfile}>Add Profile</button>

          <h2 style={{ marginTop: '2rem' }}>Current Profiles</h2>
          {profiles.map(profile => (
            <div key={profile.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <strong>{profile.name}</strong> ({profile.address})<br />
              <button onClick={() => handleDelete(profile.id)} style={{ marginTop: '0.5rem' }}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Search by name or location..." value={search} onChange={handleSearch} style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }} />
          {loading ? <p>Loading profiles...</p> : (
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {filteredProfiles.map((profile) => (
                <div key={profile.id} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.name}</h2>
                    <p>{profile.description}</p>
                    <button onClick={() => setSelectedProfile(profile)} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
                      Summary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <button
              onClick={() => setSelectedProfile(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedProfile.name}'s Location</h3>
            <p>{selectedProfile.address}</p>
            <p>{selectedProfile.details}</p>
            <div style={{ height: '300px', marginTop: '1rem' }}>
              <MapContainer center={selectedProfile.coordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={selectedProfile.coordinates} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                  <Popup>
                    <strong>{selectedProfile.name}</strong><br />
                    {selectedProfile.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}