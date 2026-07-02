import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import {
  FaRobot,
  FaPaperPlane,
  FaHeartbeat,
  FaMicrophone,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const defaultMessage = {
  sender: "ai",
  text: `# Welcome to the Health Assistant 👋

Tell me your symptoms and I’ll help you with:

- Possible causes
- Basic care suggestions
- Warning signs to watch
- When to visit a doctor

Example:
- "I have headache and fever"
- "Chest pain since morning"
- "Feeling dizzy after eating"
`,
  time: getCurrentTime(),
};

const AIHealthAssistant = () => {
  const [input, setInput] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const quickSymptoms = [
    "Fever",
    "Cough",
    "Headache",
    "Chest Pain",
    "Body Pain",
    "Dizziness",
  ];

  const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "blood vomiting",
    "vomiting blood",
    "unconscious",
    "stroke",
    "heart attack",
    "severe bleeding",
    "seizure",
    "fainted",
    "can’t breathe",
  ];

  const doctorRecommendations = {
    headache: "Neurologist",
    migraine: "Neurologist",
    chest: "Cardiologist",
    heart: "Cardiologist",
    cough: "Pulmonologist",
    breathing: "Pulmonologist",
    skin: "Dermatologist",
    rash: "Dermatologist",
    stomach: "Gastroenterologist",
    vomiting: "Gastroenterologist",
    bone: "Orthopedic",
    joint: "Orthopedic",
    fever: "General Physician",
    weakness: "General Physician",
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await API.get("/chat/my");

        if (data.length > 0) {
          setMessages(data);
        } else {
          setMessages([defaultMessage]);
        }
      } catch (error) {
        console.log(error);
        setMessages([defaultMessage]);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const saveToDB = async (message) => {
    try {
      await API.post("/chat", message);
    } catch (error) {
      console.log(error);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return alert("Speech Recognition is not supported in your browser.");
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const getDoctorRecommendation = (symptom) => {
    const text = symptom.toLowerCase();

    for (const keyword in doctorRecommendations) {
      if (text.includes(keyword)) {
        return doctorRecommendations[keyword];
      }
    }

    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;

    const recommendedDoctor = getDoctorRecommendation(currentInput);

    if (recommendedDoctor) {
      setSelectedSpecialist(recommendedDoctor);
    }

    const isEmergency = emergencyKeywords.some((keyword) =>
      currentInput.toLowerCase().includes(keyword),
    );

    if (isEmergency) {
      const userMessage = {
        sender: "user",
        text: currentInput,
        time: getCurrentTime(),
      };

      const emergencyMessage = {
        sender: "ai",
        text: `# ⚠ Emergency Alert

Your symptoms may indicate a serious medical condition.

## Immediate Action:
- Contact emergency services immediately
- Visit the nearest hospital
- Do not rely only on AI advice

**Seek professional medical help now.**`,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, userMessage, emergencyMessage]);

      await saveToDB(userMessage);
      await saveToDB(emergencyMessage);

      setInput("");
      return;
    }

    const userMessage = {
      sender: "user",
      text: currentInput,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await saveToDB(userMessage);

    setInput("");
    setLoading(true);

    try {
      const { data } = await API.post("/ai/chat", {
        message: currentInput,
      });

      const aiMessage = {
        sender: "ai",
        text: recommendedDoctor
          ? `${data.reply}

## 👨‍⚕ Recommended Specialist
You should consider consulting a **${recommendedDoctor}** for these symptoms.

Click below to book an appointment.`
          : data.reply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveToDB(aiMessage);
    } catch (error) {
      console.log(error);

      const errorMessage = {
        sender: "ai",
        text: "Something went wrong. Please try again.",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      await saveToDB(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSymptom = (symptom) => {
    setInput(symptom);
  };

  const clearChat = async () => {
    try {
      await API.delete("/chat/clear");

      setMessages([
        {
          ...defaultMessage,
          time: getCurrentTime(),
        },
      ]);

      setSelectedSpecialist("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="assistant-header">
            <div>
              <h1>AI Health Assistant</h1>
              <p>Ask symptoms and get instant AI-powered health guidance.</p>
            </div>

            <button className="clear-chat-btn" onClick={clearChat}>
              Clear Chat
            </button>
          </div>

          <div className="assistant-layout">
            <div className="chat-box">
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}`}>
                    {msg.sender === "ai" && <FaRobot />}

                    <div className="chat-text">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>

                      {msg.text.includes("Recommended Specialist") &&
                        selectedSpecialist && (
                          <button
                            className="book-now-btn"
                            onClick={() => {
                              window.location.href = `/appointment?specialist=${encodeURIComponent(
                                selectedSpecialist,
                              )}`;
                            }}
                          >
                            Book Appointment
                          </button>
                        )}

                      <div className="message-time">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="chat-message ai">
                    <FaRobot />
                    <div className="chat-text">
                      <p>Typing...</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef}></div>
              </div>

              <div className="chat-input-box">
                <button
                  type="button"
                  className={`mic-btn ${isListening ? "listening" : ""}`}
                  onClick={startListening}
                >
                  <FaMicrophone />
                </button>

                <input
                  type="text"
                  placeholder="Describe your symptoms..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />

                <button onClick={sendMessage} disabled={loading}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>

            <div className="assistant-side">
              <div className="assistant-card">
                <h2>
                  <FaHeartbeat /> Quick Symptoms
                </h2>

                <div className="symptom-tags">
                  {quickSymptoms.map((symptom, index) => (
                    <span
                      key={index}
                      onClick={() => handleQuickSymptom(symptom)}
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="assistant-card">
                <h2>AI Suggestions</h2>

                <ul className="dashboard-list">
                  <li>Drink plenty of water</li>
                  <li>Take proper rest</li>
                  <li>Monitor symptoms regularly</li>
                  <li>Avoid self-medication</li>
                  <li>Consult doctor if condition worsens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHealthAssistant;
