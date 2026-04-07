function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = "message " + type;
  msg.innerText = text;

  document.getElementById("chat-box").appendChild(msg);
  scroll();
}

function addImage(url) {
  const img = document.createElement("img");
  img.src = url;
  img.className = "meme-img";

  document.getElementById("chat-box").appendChild(img);
  scroll();
}

function scroll() {
  const chat = document.getElementById("chat-box");
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const res = await fetch("https://premiumnonsense-production.up.railway.app/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  addMessage(data.reply, "bot");

  // meme
  if (Math.random() < 0.3) {
    const memeRes = await fetch("https://premiumnonsense-production.up.railway.app/meme");
    const meme = await memeRes.json();
    addImage(meme.url);
  }
}

document.getElementById("user-input")
  .addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});