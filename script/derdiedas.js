document.addEventListener("DOMContentLoaded", async () => {
  try {
    const loadingEl = document.getElementById("loading");
    const loadingText = document.getElementById("loadingText");
    const contentEl = document.getElementById("content");

    loadingText.innerText = "Good Luck...☕";

    // URL’den topic al
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (!topic) {
      loadingText.innerText = "Topic not found";
      return;
    }

    const res = await fetch(
      "https://derdiedas-backend.onrender.com/topic?topic=" +
        encodeURIComponent(topic),
    );

    if (!res.ok) {
      loadingText.innerText = "API error";
      return;
    }

    const topicData = await res.json();

    if (!topicData || !Array.isArray(topicData.substopics)) {
      loadingText.innerText = "No data";
      return;
    }

    state.words = shuffle(topicData.substopics);

    if (state.words.length === 0) {
      loadingText.innerText = "Empty topic";
      return;
    }

    renderWord();

    // ⭐ LOADING KAPAT
    loadingEl.style.display = "none";
    contentEl.style.display = "block";
  } catch (err) {
    console.error(err);
  }
});
