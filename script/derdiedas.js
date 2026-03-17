const loadingEl = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const contentEl = document.getElementById("content");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    loadingText.innerText = "Server is waking up... ☕";

    // URL’den topic al
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (!topic) {
      loadingText.innerText = "Topic not found";
      return;
    }

    // MongoDB API çağrısı
    const res = await fetch(
      "https://derdiedas-backend.onrender.com/topic?topic=" +
        encodeURIComponent(topic),
    );

    if (!res.ok) {
      loadingText.innerText = "API Error";
      return;
    }

    const topicData = await res.json();

    if (!topicData || !Array.isArray(topicData.substopics)) {
      loadingText.innerText = "No data in database";
      return;
    }

    // state'e yükle
    state.words = shuffle(topicData.substopics);

    if (state.words.length === 0) {
      loadingText.innerText = "No words in this topic";
      return;
    }

    // ilk kelimeyi göster
    renderWord();

    // ⭐ loading kapat
    loadingEl.style.display = "none";
    contentEl.style.display = "block";
  } catch (err) {
    console.error("Mongo fetch error:", err);
    loadingText.innerText = "Connection error";
  }
});
