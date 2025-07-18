import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Papa from "papaparse";

export default function AdminSummary() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch party details and RSVPs
  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const partyDoc = await getDoc(doc(db, "parties", id));
        if (partyDoc.exists()) {
          setParty(partyDoc.data());
        } else {
          alert("❌ Party not found!");
        }
      } catch (err) {
        console.error("Error fetching party details:", err);
        alert("Failed to load party details.");
      }
    };

    const fetchResponses = async () => {
      try {
        const responseSnapshot = await getDocs(
          collection(db, "parties", id, "responses")
        );
        const rsvpList = responseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResponses(rsvpList);
      } catch (err) {
        console.error("Error fetching responses:", err);
        alert("Failed to load RSVP responses.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
    fetchResponses();
  }, [id]);

  // Download CSV
  const handleDownloadCSV = () => {
    if (responses.length === 0) {
      alert("❌ No RSVPs to download.");
      return;
    }

    const csv = Papa.unparse(
      responses.map((r) => ({
        "Employee ID": r.employeeId || "N/A",
        Name: r.name,
        "Work Email": r.workEmail || "N/A",
        Attendance: r.attendance,
        Drinker: r.drinker,
        "Drink Preference": r.drinkPreference,
        "Submitted At": new Date(r.submittedAt).toLocaleString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `RSVP_List_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 flex justify-center items-center p-2 sm:p-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-6xl overflow-hidden">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-white mb-4 sm:mb-6 drop-shadow-lg">
          📋 Admin Summary
        </h1>

        {loading ? (
          <p className="text-white text-center">Loading data...</p>
        ) : (
          <>
            {party && (
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 text-white mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  🎉 {party.eventTitle}
                </h2>
                <p className="text-sm sm:text-base">👔 Hosted by: {party.companyName}</p>
                <p className="text-sm sm:text-base">
                  📅 Date: {new Date(party.date).toLocaleDateString()}
                </p>
                <p className="text-sm sm:text-base">📍 Location: {party.location}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
              <h3 className="text-lg sm:text-2xl font-semibold text-white">
                📝 RSVP Responses ({responses.length})
              </h3>
              <button
                onClick={handleDownloadCSV}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl px-4 py-2 hover:scale-105 transition transform shadow-lg"
              >
                📥 Download CSV
              </button>
            </div>

            {responses.length > 0 ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-xs sm:text-sm bg-white/20 text-white rounded-xl shadow-inner">
                  <thead className="sticky top-0 bg-white/10">
                    <tr className="text-left">
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Emp ID</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Name</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Email</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Attend</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Drinker</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Preference</th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response, index) => (
                      <tr
                        key={response.id}
                        className={`${
                          index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                        }`}
                      >
                        <td className="px-2 py-2 sm:px-4 sm:py-2">
                          {response.employeeId || "N/A"}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">{response.name}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">{response.workEmail || "N/A"}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">{response.attendance}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">{response.drinker}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">{response.drinkPreference}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-2">
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-white text-center">No RSVPs yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
