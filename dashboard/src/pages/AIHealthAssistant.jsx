import Sidebar from "../components/Sidebar";
import { FaRobot, FaPaperPlane, FaHeartbeat } from "react-icons/fa";

const AIHealthAssistant = () => {
  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>AI Health Assistant</h1>
        <p>Ask symptoms and get instant AI-powered health guidance.</p>

        <div className="assistant-layout">
          <div className="chat-box">
            <div className="chat-messages">
              <div className="chat-message user">
                <p>I have headache and fever since morning.</p>
              </div>
              <div className="chat-message ai">
                <FaRobot />
                <p>
                  It may be a viral infection or dehydration. Stay hydrated and
                  monitor temperature. If fever exceeds 101°F, consult a doctor.
                </p>
              </div>

              <div className="chat-message user">
                <p>Should I take medicine for this?</p>
              </div>

              <div className="chat-message ai">
                <FaRobot />
                <p>
                  You may take paracetamol for fever, but avoid self-medication
                  for stronger symptoms without consulting a doctor.
                </p>
              </div>

              <div className="chat-message user">
                <p>How much water should I drink?</p>
              </div>

              <div className="chat-message ai">
                <FaRobot />
                <p>
                  Try drinking at least 2–3 liters today. Hydration is important
                  during fever.
                </p>
              </div>
            </div>

            <div className="chat-input-box">
              <input type="text" placeholder="Describe your symptoms..." />
              <button>
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
                <span>Fever</span>
                <span>Cough</span>
                <span>Headache</span>
                <span>Chest Pain</span>
                <span>Body Pain</span>
                <span>Dizziness</span>
              </div>
            </div>

            <div className="assistant-card">
              <h2>AI Suggestions</h2>

              <ul className="dashboard-list">
                <li>Drink plenty of water</li>
                <li>Take rest for 24 hours</li>
                <li>Monitor body temperature</li>
                <li>Consult doctor if symptoms worsen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHealthAssistant;
