document.addEventListener("DOMContentLoaded", async () => {
  const loadingEl = document.getElementById("loadingScreen");
  const loadingText = document.getElementById("loadingText");
  const contentEl = document.getElementById("content");

  if (!loadingEl || !loadingText || !contentEl) {
    console.error("Loading elements missing");
    return;
  }

  // ⭐ değişen mesajlar
const messages = [
  "One-time loading...",
  "📚 Preparing the words...",
  "⚡ Starting the system...",
  "🧠 Initializing the learning engine...",
  "🎯 Applying final touches...",
  "🚀 Launching the game..."
];

  let i = 0;

  const interval = setInterval(() => {
    i = (i + 1) % messages.length;
    loadingText.style.opacity = 0;

    setTimeout(() => {
      loadingText.innerText = messages[i];
      loadingText.style.opacity = 1;
    }, 300);
  }, 1700);

  try {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (!topic) {
      loadingText.innerText = "Topic bulunamadı";
      return;
    }

    const res = await fetch(
      "https://derdiedas-backend.onrender.com/topic?topic=" +
        encodeURIComponent(topic),
    );

    if (!res.ok) {
      loadingText.innerText = "Server hatası";
      return;
    }

    const data = await res.json();

    if (!data || !data.substopics) {
      loadingText.innerText = "Veri bulunamadı";
      return;
    }

    state.words = shuffle(data.substopics);

    renderWord();
    bindEvents();
    startTimer();

    clearInterval(interval);

    // ⭐ loading kapat
    loadingEl.style.display = "none";
    contentEl.style.display = "flex";
  } catch (e) {
    console.error(e);
    loadingText.innerText = "Bağlantı problemi...";
  }
});
