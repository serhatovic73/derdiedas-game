document.addEventListener("DOMContentLoaded", async () => {
  try {
    // URL’den topic al
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (!topic) {
      console.error("Topic param missing");
      return;
    }

    // ⭐ MongoDB API çağrısı
    const res = await fetch(
      "http://localhost:5000/topic?topic=" + encodeURIComponent(topic),
    );

    if (!res.ok) {
      console.error("API error:", res.status);
      return;
    }

    const topicData = await res.json();

    // ⭐ MongoDB object kontrol
    if (!topicData || !Array.isArray(topicData.substopics)) {
      console.error("Topic not found in database");
      return;
    }

    // ⭐ Kelimeleri state’e yükle
    state.words = shuffle(topicData.substopics);

    if (state.words.length === 0) {
      console.error("No words in this topic");
      return;
    }

    // ⭐ İlk kelimeyi göster
    renderWord();
  } catch (err) {
    console.error("MongoDB fetch error:", err);
  }
});
