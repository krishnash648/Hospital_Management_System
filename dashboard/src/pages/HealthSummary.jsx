import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const HealthSummary = () => {
  const [formData, setFormData] = useState({
    weight: "",
    hydration: "",
    heartRateStability: "",
    sleepQuality: "",
    bloodGroup: "",
  });

  const [timeline, setTimeline] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchHealthData = useCallback(async () => {
    try {
      const { data } = await API.get("/health/my");

      if (data) {
        setFormData({
          weight: data.weight || "",
          hydration: data.hydration || "",
          heartRateStability: data.heartRateStability || "",
          sleepQuality: data.sleepQuality || "",
          bloodGroup: data.bloodGroup || "",
        });
      }

      const { data: timelineData } = await API.get("/timeline/my");
      setTimeline(timelineData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load health data");
    }
  }, []);

  useEffect(() => {
    const loadHealthData = async () => {
      await fetchHealthData();
    };

    loadHealthData();
  }, [fetchHealthData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/health", formData);
      toast.success("Health profile updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update health profile");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "appointment":
        return "📅";
      case "payment":
        return "💳";
      case "prescription":
        return "💊";
      case "report":
        return "📄";
      default:
        return "📌";
    }
  };

  const filteredTimeline =
    filter === "all"
      ? timeline
      : timeline.filter((item) => item.type === filter);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          {/* Health Profile */}
          <div className="page-header">
            <h1>Health Summary</h1>
            <p>Manage and update your health profile.</p>
          </div>

          <div className="settings-card">
            <form className="settings-form" onSubmit={handleSubmit}>
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
              />

              <input
                type="number"
                name="hydration"
                placeholder="Hydration (%)"
                value={formData.hydration}
                onChange={handleChange}
              />

              <input
                type="number"
                name="heartRateStability"
                placeholder="Heart Rate Stability (%)"
                value={formData.heartRateStability}
                onChange={handleChange}
              />

              <input
                type="number"
                name="sleepQuality"
                placeholder="Sleep Quality (%)"
                value={formData.sleepQuality}
                onChange={handleChange}
              />

              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group"
                value={formData.bloodGroup}
                onChange={handleChange}
              />

              <button type="submit" className="save-btn">
                Save Health Profile
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="settings-card">
            <h2>Medical History Timeline</h2>

            <div className="timeline-filters">
              <button onClick={() => setFilter("all")}>All</button>
              <button onClick={() => setFilter("appointment")}>
                Appointments
              </button>
              <button onClick={() => setFilter("payment")}>Payments</button>
              <button onClick={() => setFilter("prescription")}>
                Prescriptions
              </button>
              <button onClick={() => setFilter("report")}>Reports</button>
            </div>

            {filteredTimeline.length > 0 ? (
              <div className="timeline-container">
                {filteredTimeline.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">{getIcon(item.type)}</div>

                    <div className="timeline-content">
                      <h4>{item.title}</h4>

                      <span className={`timeline-status ${item.status}`}>
                        {item.status}
                      </span>

                      <p>{item.date?.split("T")[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No medical history found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthSummary;
