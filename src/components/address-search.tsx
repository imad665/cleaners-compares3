"use client";

import { useState } from "react";

export default function PostcodeAddressSearch() {
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const searchAddresses = async (pc: string) => {
    setPostcode(pc);
    if (pc.length < 2) return; // Wait until 3+ chars
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        pc
      )}&addressdetails=1&limit=50`
    );
    const data = await res.json();
    setAddresses(data);
  };

  const handleSelect = (address: string) => {
    setSelectedAddress(address);
    setAddresses([]); // hide list after selection
  };

  return (
    <div style={{ maxWidth: 400 }}>
      {/* Postcode Input */}
      <input
        value={postcode}
        onChange={(e) => searchAddresses(e.target.value)}
        placeholder="Enter UK postcode"
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />

      {/* Address Suggestions */}
      {addresses.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {addresses.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place.display_name)}
              style={{
                padding: "6px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Final Address Field */}
      <input
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
        placeholder="Selected address"
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      />
    </div>
  );
}
