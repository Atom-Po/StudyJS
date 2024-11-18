// 사용자 API 키 저장
let apiKey = "";
let conversationHistory = []; // 최근 대화 저장용 배열

// DOM 요소 가져오기
const apiKeyInput = document.getElementById("api-key-input");
const setApiKeyButton = document.getElementById("set-api-key-button");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// API 키 설정 함수
function setApiKey() {
  apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    document.getElementById("api-key-container").style.display = "none";
    chatContainer.style.display = "flex";
  } else {
    alert("Please enter a valid API key.");
  }
}

// 메시지 요소 생성 함수
function createMessageElement(text, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = text;
  return messageElement;
}

// 사용자 입력 전송 및 API 호출
async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  // 사용자 메시지 화면에 표시
  messagesContainer.appendChild(createMessageElement(userMessage, "user"));
  userInput.value = "";

  // 대화 히스토리에 사용자 메시지 추가
  conversationHistory.push({ role: "user", content: userMessage });
  if (conversationHistory.length > 10) {
    conversationHistory.shift(); // 10개 초과 시 오래된 대화 삭제
  }

  // ChatGPT API에 요청
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      }),
    });

    const data = await response.json();
    const chatgptMessage = data.choices[0].message.content;

    // GPT 응답 화면에 표시
    messagesContainer.appendChild(
      createMessageElement(chatgptMessage, "chatgpt")
    );

    // 대화 히스토리에 GPT 응답 추가
    conversationHistory.push({ role: "assistant", content: chatgptMessage });
    if (conversationHistory.length > 10) {
      conversationHistory.shift(); // 10개 초과 시 오래된 대화 삭제
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    messagesContainer.appendChild(
      createMessageElement(
        "Error fetching response. Please try again.",
        "chatgpt"
      )
    );
  }
}

// 엔터키 이벤트 및 버튼 클릭 이벤트 리스너
setApiKeyButton.addEventListener("click", setApiKey);
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
});
