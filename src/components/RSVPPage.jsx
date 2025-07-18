import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function RSVPPage() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [attendance, setAttendance] = useState("Present");
  const [drinker, setDrinker] = useState("Non-Drinker");
  const [drinkPreference, setDrinkPreference] = useState("Mocktails");
  const [submitted, setSubmitted] = useState(false);

  // Fetch party details
  useEffect(() => {
    const fetchParty = async () => {
      try {
        const docRef = doc(db, "parties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setParty(docSnap.data());
        } else {
          alert("❌ Party not found!");
        }
      } catch (error) {
        console.error("Error fetching party:", error);
        alert("❌ Failed to load party.");
      }
    };
    fetchParty();
  }, [id]);

  // Submit RSVP response
  const handleSubmit = async () => {
    if (!name.trim() || !employeeId.trim()) {
      alert("❌ Please enter your Name and Employee ID!");
      return;
    }

    try {
      const responsesRef = collection(db, "parties", id, "responses");
      const q = query(responsesRef, where("employeeId", "==", employeeId));
      const querySnapshot = await getDocs(q);

      const responseData = {
        name,
        employeeId,
        workEmail,
        attendance,
        drinker: attendance === "Present" ? drinker : "Not Applicable",
        drinkPreference:
          attendance === "Present" && drinker === "Drinker"
            ? drinkPreference
            : "Not Applicable",
        submittedAt: new Date().toISOString(),
      };

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(
          doc(db, "parties", id, "responses", existingDoc.id),
          responseData
        );
        alert("✅ RSVP Updated Successfully!");
      } else {
        await addDoc(responsesRef, responseData);
        alert("🎉 RSVP Submitted Successfully!");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("❌ Failed to submit RSVP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex justify-center items-center p-4">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-lg">
        {party ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-3 drop-shadow-lg">
              🎉 RSVP for {party.eventTitle}
            </h1>
            <p className="text-center text-white/80 text-sm sm:text-base mb-5">
              Hosted by {party.companyName} on{" "}
              {new Date(party.date).toLocaleDateString()} at {party.location}
            </p>

            {!submitted ? (
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 sm:py-3 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 sm:py-3 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="email"
                  placeholder="Work Email (optional)"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 sm:py-3 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-white font-medium text-sm sm:text-base">Will you attend?</label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white appearance-none"
                  >
                    <option className="bg-gray-800" value="Present">Present</option>
                    <option className="bg-gray-800" value="Not Present">Not Present</option>
                  </select>
                </div>

                {attendance === "Present" && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-white font-medium text-sm sm:text-base">Are you a drinker?</label>
                      <select
                        value={drinker}
                        onChange={(e) => setDrinker(e.target.value)}
                        className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white appearance-none"
                      >
                        <option className="bg-gray-800" value="Drinker">Drinker</option>
                        <option className="bg-gray-800" value="Non-Drinker">Non-Drinker</option>
                      </select>
                    </div>

                    {drinker === "Drinker" && (
                      <div className="flex flex-col gap-2">
                        <label className="text-white font-medium text-sm sm:text-base">What drinks do you prefer?</label>
                        <select
                          value={drinkPreference}
                          onChange={(e) => setDrinkPreference(e.target.value)}
                          className="w-full bg-white/30 border border-white/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white appearance-none"
                        >
                          <option className="bg-gray-800" value="Beer">🍺 Beer</option>
                          <option className="bg-gray-800" value="Whisky">🥃 Whisky</option>
                          <option className="bg-gray-800" value="Cocktails">🍹 Cocktails</option>
                          <option className="bg-gray-800" value="Mocktails">🍹 Mocktails</option>
                          <option className="bg-gray-800" value="Wine">🍷 Wine</option>
                        </select>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl px-4 py-3 hover:scale-105 transition transform shadow-lg"
                >
                  Submit RSVP
                </button>
              </div>
            ) : (
              <p className="text-white text-center text-lg sm:text-xl font-semibold">
                ✅ Thank you for your RSVP!
              </p>
            )}
          </>
        ) : (
          <p className="text-white text-center">Loading party details...</p>
        )}
      </div>
    </div>
  );
}
