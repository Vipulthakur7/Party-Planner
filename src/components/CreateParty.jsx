import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function CreateParty() {
  const [companyName, setCompanyName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [adminLink, setAdminLink] = useState("");

  const handleCreateParty = async () => {
    // Validate Name (No special characters)
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!companyName.match(nameRegex)) {
      alert("❌ Company Name must not include special characters!");
      return;
    }

    if (!eventTitle.match(nameRegex)) {
      alert("❌ Event Title must not include special characters!");
      return;
    }

    if (!companyName || !eventTitle || !eventDate) {
      alert("❌ Company Name, Event Title, and Date are required!");
      return;
    }

    const id = Math.random().toString(36).substring(2, 8);
    const partyData = {
      companyName,
      eventTitle,
      date: eventDate,
      location: location || "Not specified",
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "parties", id), partyData);

      const baseUrl = window.location.origin;
      setEventLink(`${baseUrl}/#/rsvp/${id}`);
      setAdminLink(`${baseUrl}/#/admin/${id}`);

      alert("🎉 Party created successfully!");
    } catch (error) {
      console.error("Error creating party:", error);
      alert("❌ Failed to create party. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex justify-center items-center p-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-4 sm:mb-6 drop-shadow-lg">
          🎉 Plan Your Party
        </h1>
        <p className="text-center text-white/80 mb-4 sm:mb-6">
          Enter details to create your party and share the RSVP link.
        </p>

        <div className="space-y-4 sm:space-y-5">
          {/* Company Name */}
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-3 placeholder-white text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Event Title */}
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-3 placeholder-white text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Event Date with Label */}
          <div className="flex flex-col">
            <label className="text-white mb-1 font-medium">📅 Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-3 text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white appearance-none"
            />
          </div>

          {/* Location */}
          <input
            type="text"
            placeholder="Location (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-3 placeholder-white text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Button */}
          <button
            onClick={handleCreateParty}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl px-4 py-3 text-lg hover:scale-105 transition transform shadow-lg"
          >
            Create Party & Get Links
          </button>
        </div>

        {/* Generated Links */}
        {eventLink && (
          <div className="mt-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 text-white shadow-inner">
            <h2 className="font-semibold text-lg mb-2">🎯 Your Links</h2>
            <p className="text-sm">
              <strong>RSVP Link:</strong>{" "}
              <a href={eventLink} className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                {eventLink}
              </a>
            </p>
            <p className="text-sm mt-2">
              <strong>Admin Link:</strong>{" "}
              <a href={adminLink} className="text-red-300 underline" target="_blank" rel="noopener noreferrer">
                {adminLink}
              </a>
            </p>
          </div>
        )}

        {/* ❤️ Footer */}
        <div className="absolute bottom-3 left-0 right-0 text-center text-white/60 text-xs mt-6 sm:mt-2">
  Developed with <span className="text-red-400">❤️</span> by Vipul
</div>
      </div>
    </div>
  );
}
