// Global variables
let currentLanguage = "en";
let isRecording = false;
let recognition;

// Initialize speech recognition
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

// Tab switching functionality
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all nav tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab content
  document.getElementById(tabName).classList.add("active");

  // Add active class to clicked nav tab
  event.target.classList.add("active");

  // Initialize charts when analytics tab is opened
  if (tabName === "analytics") {
    setTimeout(initializeAnalyticsCharts, 100);
  }
}

// Language change functionality
function changeLanguage() {
  currentLanguage = document.getElementById("language").value;
  const messages = document.getElementById("chatMessages");

  const welcomeMessages = {
    en: "Hello! I'm your farming assistant. How can I help you today?",
    hi: "नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    mr: "नमस्कार! मी तुमचा शेती सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
    ta: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    te: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
  };

  // Add language change message
  const langMessage = document.createElement("div");
  langMessage.className = "message bot";
  langMessage.innerHTML = `<strong>AgriGrow AI:</strong> ${welcomeMessages[currentLanguage]}`;
  messages.appendChild(langMessage);
  messages.scrollTop = messages.scrollHeight;
}

// Chat functionality
function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, "user");

  // Clear input
  input.value = "";

  // Process AI response
  setTimeout(() => {
    const response = getAIResponse(message);
    addMessage(response, "bot");
  }, 1000);
}

function addMessage(message, sender) {
  const messages = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  if (sender === "bot") {
    messageDiv.innerHTML = `<strong>AgriGrow AI:</strong> ${message}`;
  } else {
    messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
  }

  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(message) {
  const responses = {
    en: {
      weather:
        "🌤️ Today's weather: Partly cloudy with 65% chance of rain in the afternoon. Temperature: 28°C. I recommend avoiding irrigation today.",
      irrigation:
        "💧 Based on soil moisture (72%) and weather forecast, skip watering today. Rain expected in 4 hours. This will save you ₹50 in water costs!",
      fertilizer:
        "🌱 Your soil pH is 6.8 (slightly acidic). Apply nitrogen fertilizer after the expected rain. Best time: Tomorrow morning between 6-8 AM.",
      pest: "🐛 Current pest risk: Medium for aphids. Monitor leaves for small green insects. If found, use neem oil spray in evening hours.",
      crop: "✅ Your crop health is good! Growth rate is 15% above average. Keep monitoring soil moisture and follow AI recommendations.",
      default:
        "I can help you with weather forecasts, irrigation timing, fertilizer advice, pest control, and crop health monitoring. What would you like to know?",
    },
    hi: {
      weather:
        "🌤️ आज का मौसम: आंशिक रूप से बादल, दोपहर में 65% बारिश की संभावना। तापमान: 28°C। मैं आज सिंचाई न करने की सलाह देता हूं।",
      irrigation:
        "💧 मिट्टी की नमी (72%) और मौसम पूर्वानुमान के आधार पर, आज पानी न दें। 4 घंटे में बारिश होगी। इससे आपकी ₹50 की बचत होगी!",
      fertilizer:
        "🌱 आपकी मिट्टी का pH 6.8 है (थोड़ा अम्लीय)। अपेक्षित बारिश के बाद नाइट्रोजन उर्वरक डालें। सबसे अच्छा समय: कल सुबह 6-8 बजे के बीच।",
      pest: "🐛 वर्तमान कीट जोखिम: एफिड्स के लिए मध्यम। छोटे हरे कीड़ों के लिए पत्तियों की निगरानी करें। यदि मिले तो शाम के समय नीम का तेल स्प्रे करें।",
      crop: "✅ आपकी फसल का स्वास्थ्य अच्छा है! वृद्धि दर औसत से 15% अधिक है। मिट्टी की नमी की निगरानी करते रहें।",
      default:
        "मैं मौसम पूर्वानुमान, सिंचाई समय, उर्वरक सलाह, कीट नियंत्रण और फसल स्वास्थ्य निगरानी में आपकी मदद कर सकता हूं।",
    },
  };

  const lang = currentLanguage === "hi" ? "hi" : "en";
  const langResponses = responses[lang];

  // Simple keyword matching
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("weather") || lowerMessage.includes("मौसम")) {
    return langResponses.weather;
  } else if (
    lowerMessage.includes("water") ||
    lowerMessage.includes("irrigation") ||
    lowerMessage.includes("पानी") ||
    lowerMessage.includes("सिंचाई")
  ) {
    return langResponses.irrigation;
  } else if (
    lowerMessage.includes("fertilizer") ||
    lowerMessage.includes("उर्वरक")
  ) {
    return langResponses.fertilizer;
  } else if (lowerMessage.includes("pest") || lowerMessage.includes("कीट")) {
    return langResponses.pest;
  } else if (
    lowerMessage.includes("crop") ||
    lowerMessage.includes("health") ||
    lowerMessage.includes("फसल")
  ) {
    return langResponses.crop;
  } else {
    return langResponses.default;
  }
}

function askPredefinedQuestion(type) {
  const questions = {
    weather: "What is the weather forecast for today?",
    irrigation: "When should I irrigate my crops?",
    fertilizer: "What fertilizer should I use?",
    pest: "How can I control pests?",
    crop: "How is my crop health?",
  };

  const input = document.getElementById("chatInput");
  input.value = questions[type];
  sendMessage();
}

function handleEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Voice functionality
function toggleVoice() {
  const voiceBtn = document.getElementById("voiceBtn");

  if (!recognition) {
    alert("Speech recognition not supported in this browser");
    return;
  }

  if (isRecording) {
    recognition.stop();
    voiceBtn.classList.remove("recording");
    voiceBtn.innerHTML = "🎤";
    isRecording = false;
  } else {
    recognition.start();
    voiceBtn.classList.add("recording");
    voiceBtn.innerHTML = "🔴";
    isRecording = true;
  }
}

// Setup speech recognition events
if (recognition) {
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("chatInput").value = transcript;
    toggleVoice();
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
    toggleVoice();
  };
}

// Initialize sensor data updates
function updateSensorData() {
  // Simulate real-time sensor data updates
  const soilMoisture = Math.floor(Math.random() * 20) + 65; // 65-85%
  const temperature = Math.floor(Math.random() * 10) + 25; // 25-35°C
  const humidity = Math.floor(Math.random() * 15) + 60; // 60-75%
  const lightIntensity = Math.floor(Math.random() * 200) + 800; // 800-1000 LUX
  const phLevel = (Math.random() * 1.5 + 6.0).toFixed(1); // 6.0-7.5

  document.getElementById("soilMoisture").textContent = soilMoisture + "%";
  document.getElementById("temperature").textContent = temperature + "°C";
  document.getElementById("humidity").textContent = humidity + "%";
  document.getElementById("lightIntensity").textContent =
    lightIntensity + " LUX";
  document.getElementById("phLevel").textContent = phLevel;

  // Update status colors
  const moistureEl = document.getElementById("soilMoisture");
  if (soilMoisture > 70) {
    moistureEl.className = "metric-value status-good";
  } else if (soilMoisture > 50) {
    moistureEl.className = "metric-value status-warning";
  } else {
    moistureEl.className = "metric-value status-critical";
  }
}

// Initialize main dashboard chart
function initializeDashboardChart() {
  const ctx = document.getElementById("sensorChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
      datasets: [
        {
          label: "Soil Moisture (%)",
          data: [75, 73, 70, 68, 72, 74],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
        },
        {
          label: "Temperature (°C)",
          data: [22, 25, 28, 31, 29, 26],
          borderColor: "#FF6B6B",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Real-time Sensor Data",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initialize analytics charts
function initializeAnalyticsCharts() {
  // Yield Chart
  const yieldCtx = document.getElementById("yieldChart").getContext("2d");
  new Chart(yieldCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Predicted Yield (kg)",
          data: [120, 135, 150, 165, 180, 195],
          backgroundColor: "rgba(76, 175, 80, 0.8)",
          borderColor: "#4CAF50",
          borderWidth: 1,
        },
        {
          label: "Actual Yield (kg)",
          data: [115, 130, 145, 160, 175, 0],
          backgroundColor: "rgba(33, 150, 243, 0.8)",
          borderColor: "#2196F3",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Yield Prediction vs Actual",
        },
      },
    },
  });

  // Water Usage Chart
  const waterCtx = document.getElementById("waterChart").getContext("2d");
  new Chart(waterCtx, {
    type: "doughnut",
    data: {
      labels: ["Optimal Usage", "Saved Water", "Traditional Usage"],
      datasets: [
        {
          data: [60, 25, 15],
          backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Water Usage Optimization",
        },
      },
    },
  });

  // Crop Health Chart
  const healthCtx = document.getElementById("healthChart").getContext("2d");
  new Chart(healthCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Crop Health Score",
          data: [65, 70, 75, 80, 85, 88],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Crop Health Progress",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Initialize dashboard chart
  initializeDashboardChart();

  // Start sensor data updates
  updateSensorData();
  setInterval(updateSensorData, 10000); // Update every 10 seconds

  // Add initial chat message
  setTimeout(() => {
    addMessage(
      "Hello! I'm AgriGrow AI Assistant. I can help you with farming decisions in your local language. Try asking about weather, irrigation, or crop care!",
      "bot"
    );
  }, 1000);
});
