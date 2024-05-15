import Vapi from "@vapi-ai/web";

const statusDisplay = document.getElementById("status");
const speakerDisplay = document.getElementById("speaker");
const volumeDisplay = document.getElementById("volume");
const vapiTyping = document.getElementById("vapiTyping");
const vapiStatusMessage = document.getElementById("vapiStatusMessage");
const chatWindow = document.getElementById("chat");

const vapi = new Vapi("YOUR-PUBLIC-VAPI-API-KEY");

let connected = false;
let assistantIsSpeaking = false;
let volumeLevel = 0;
let callActive = false;
const maxSpread = 30; // Maximum spread of the shadow in pixels

// Vapi Event Listeners
vapi.on("call-start", function () {
  connected = true;
  updateUI();
});

vapi.on("call-end", function () {
  connected = false;
  updateUI();

  callWithVapi.style.boxShadow = `0 0 0px 0px rgba(58,25,250,0.7)`;
});

vapi.on("speech-start", function () {
  assistantIsSpeaking = true;
  updateUI();
});

vapi.on("speech-end", function () {
  assistantIsSpeaking = false;
  updateUI();
});

vapi.on("message", (message) => {
  if (message.type === "function-call") {
    // If the ChangeColor function was calles
    if (message.functionCall && message.functionCall.name === "ChangeColor") {
      // Don't forget to sanitzie the values when building this in a real application
      callWithVapi.style.backgroundColor =
        message.functionCall.parameters.ColorCode;
    }

    // If the ChangeColor function was calles
    if (message.functionCall && message.functionCall.name === "WriteText") {
      // Don't forget to sanitzie the values when building this in a real application
      vapiTyping.textContent = message.functionCall.parameters.Text;
    }
  }

  // Adds a message to the background chat
  if (message.type === "conversation-update") {
    updateChat(message);
  }
});

vapi.on("volume-level", function (level) {
  volumeLevel = level; // Level is from 0.0 to 1.0

  // Calculate the spread directly based on the volume level
  const spread = volumeLevel * maxSpread;

  volumeDisplay.textContent = `Volume: ${volumeLevel.toFixed(3)}`; // Display up to 3 decimal places for simplicity

  // Update the box shadow
  const callWithVapi = document.getElementById("callWithVapi");
  callWithVapi.style.boxShadow = `0 0 ${spread}px ${spread / 2}px rgba(58,25,250,0.7)`;
});

vapi.on("error", function (error) {
  connected = false;

  if (error.error.message) {
    vapiStatusMessage.textContent = error.error.message;
  }

  updateUI();
});

callWithVapi.addEventListener("click", function () {
  if (!callActive) {
    callActive = true;
    callWithVapi.style.backgroundColor = "#007aff";
    vapi.start(assistantOptions);
  } else {
    callActive = false;
    callWithVapi.style.backgroundColor = "#858585";
    vapi.stop();
  }
});

// Initialize background with the correct color
callWithVapi.style.backgroundColor = "#858585";

function updateChat(conversationUpdate) {
  chatWindow.innerHTML = ""; // Clear the chat window before adding new messages

  conversationUpdate.conversation.forEach((message) => {
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // Add specific class based on the role
    switch (message.role) {
      case "assistant":
        messageDiv.classList.add("assistant");
        break;
      case "user":
        messageDiv.classList.add("user");
        break;
      case "tool": // You might want a different style for tool responses
        messageDiv.classList.add("tool");
        break;
    }

    // Set text content and handle tool calls if they exist
    if (message.content) {
      messageDiv.textContent = message.content;
    } else if (message.tool_calls && message.tool_calls.length > 0) {
      // Example: Append a generic message or handle differently
      messageDiv.textContent = "Processing request...";
    }

    chatWindow.appendChild(messageDiv);
  });

  // Scroll to the bottom of the chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateUI() {
  // Update the status
  statusDisplay.textContent = `Status: ${connected ? "Connected" : "Disconnected"}`;

  // Update the speaker
  speakerDisplay.textContent = `Speaker: ${assistantIsSpeaking ? "Assistant" : "User"}`;
}

const assistantOptions = {
  name: "Lisa",
  voice: {
    voiceId: "sarah",
    provider: "11labs",
    stability: 0.5,
    similarityBoost: 0.75,
  },
  model: {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Lisa is a sophisticated AI web assistant, designed by Jannis Moore. Crafted with the persona of an experienced customer support professional in her early 30s, Lisa combines in-depth knowledge of the website's offerings with a keen sense of emotional intelligence. Her voice is clear, warm, and inviting, featuring a neutral accent to ensure accessibility for a broad user base. Lisa's primary role is to provide immediate, accurate answers to user inquiries about the Website Company, enhancing user experience and engagement.\n\nLisa's advanced programming enables her to handle a wide range of website-related questions, from basic navigation assistance to detailed explanations of services. She guides users through the website's content, offering instant feedback and support to improve their understanding and ease their journey through the site. Lisa ensures every user is met with patience, empathy, and professionalism, embodying the highest standards of customer care.\n\n**Major Mode of Interaction:** Lisa interacts primarily through text, adeptly processing written queries and responding promptly. This capability makes her an excellent resource for users seeking quick information or needing guidance on the website. Additionally, Lisa can utilize custom functions like \"WriteText\" and \"ChangeColor\" to interact with website elements directly, enhancing user interaction and providing a dynamic browsing experience.\n\n**Interaction Instructions:**\n\n-   Lisa encourages users to explore the website, acknowledging each query with confirmation of her engagement, e.g., \"Yes, I'm here. How can I assist you today?\"\n-   She emphasizes the importance of clear, empathetic communication, tailored to the context of each interaction.\n-   Lisa demonstrates how to clarify complex or vague user inquiries by asking concise questions for clarification, ensuring a smooth and efficient communication flow.\n-   She teaches users about website features and functionalities, ensuring they feel supported and informed at every step.\n-   Lisa can adapt the website's appearance through her interactive commands, improving accessibility and user satisfaction according to individual preferences.\n\nLisa's overarching mission is to enhance the user experience on the website, ensuring that every visitor can navigate and interact with the site effectively and pleasantly. She's not just an information provider but a dynamic interface designed to foster a deeper connection between the website and its users.",
      },
    ],
    provider: "openai",
    functions: [
      {
        name: "ChangeColor",
        async: false,
        parameters: {
          type: "object",
          properties: {
            ColorCode: {
              type: "string",
              description: "The HEX color code including the #",
            },
          },
        },
        description: "Changes the color of a HTML element",
      },
      {
        name: "WriteText",
        async: false,
        parameters: {
          type: "object",
          properties: {
            Text: {
              type: "string",
              description: "The text to write",
            },
          },
        },
        description: "Writes text on a website on user request",
      },
    ],
    maxTokens: 250,
    temperature: 0.7,
    emotionRecognitionEnabled: true,
  },
  recordingEnabled: true,
  firstMessage: "Hello, this is Jannis. How may I assist you today?",
  voicemailMessage:
    "You've reached our voicemail. Please leave a message after the beep, and we'll get back to you as soon as possible.",
  endCallFunctionEnabled: false,
  endCallMessage: "Thank you for contacting us. Have a great day!",
  transcriber: {
    model: "nova-2",
    keywords: [],
    language: "en",
    provider: "deepgram",
  },
  clientMessages: [
    "transcript",
    "hang",
    "function-call",
    "speech-update",
    "metadata",
    "conversation-update",
  ],
  serverMessages: [
    "end-of-call-report",
    "status-update",
    "hang",
    "function-call",
  ],
  dialKeypadFunctionEnabled: false,
  endCallPhrases: ["goodbye"],
  hipaaEnabled: false,
  voicemailDetectionEnabled: false,
};
