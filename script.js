
document.getElementById("chat-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const input = document.getElementById("user-input");
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage(userText, "user-message");
    input.value = "";

    fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
    })
    .then(res => res.json())
    .then(data => {
        appendMessage(data.reply || "No reply received.", "bot-message");
    })
    .catch(err => {
        console.error(err);
        appendMessage("Error connecting to server.", "bot-message");
    });
});

function appendMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + className;
    msgDiv.textContent = message;
    document.getElementById("chat-box").appendChild(msgDiv);
    document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
}
