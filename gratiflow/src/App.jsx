import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [entry, setEntry] = useState("");
  const [journal, setJournal] = useState([]);
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [audio] = useState(new Audio("/meditation-music.mp3"));
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("journal");
    const theme = localStorage.getItem("theme");
    if (saved) setJournal(JSON.parse(saved));
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("journal", JSON.stringify(journal));
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [journal, darkMode]);

  useEffect(() => {
    let timer;
    if (isMeditating && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      stopMeditation();
    }
    return () => clearTimeout(timer);
  }, [isMeditating, timeLeft]);

  const startMeditation = () => {
    setIsMeditating(true);
    setTimeLeft(300);
    audio.loop = true;
    audio.play();
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    audio.pause();
    audio.currentTime = 0;
    alert("Meditation complete. Write your thoughts!");
  };

  const handleSave = () => {
    if (entry.trim()) {
      const newEntry = {
        text: entry,
        date: new Date().toLocaleString(),
      };
      setJournal([newEntry, ...journal]);
      setEntry("");
    }
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${min}:${s}`;
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Gratiflow</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main>
        <div className="meditation-section">
          {isMeditating ? (
            <p className="timer">Meditating: {formatTime(timeLeft)}</p>
          ) : (
            <button onClick={startMeditation}>Start 5-Min Meditation</button>
          )}
        </div>

        <textarea
          value={entry}
          placeholder="Write your thoughts..."
          onChange={(e) => setEntry(e.target.value)}
        ></textarea>
        <button onClick={handleSave}>Save Entry</button>

        <section className="journal">
          <h2>Journal Entries</h2>
          {journal.length === 0 && <p>No entries yet.</p>}
          {journal.map((j, i) => (
            <div key={i} className="entry">
              <span>{j.date}</span>
              <p>{j.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default App;
