import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    fees: "",
    availability: [],
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [slotInput, setSlotInput] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/me");

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          fees: data.fees || "",
          availability: data.availability || [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const addSlot = () => {
    if (!selectedDate || !slotInput) {
      return toast.error("Select date and time first");
    }

    const existingDate = profile.availability.find(
      (item) => item.date === selectedDate,
    );

    if (existingDate) {
      if (existingDate.slots.includes(slotInput)) {
        return toast.error("Slot already added");
      }

      setProfile((prev) => ({
        ...prev,
        availability: prev.availability.map((item) =>
          item.date === selectedDate
            ? { ...item, slots: [...item.slots, slotInput] }
            : item,
        ),
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        availability: [
          ...prev.availability,
          {
            date: selectedDate,
            slots: [slotInput],
          },
        ],
      }));
    }

    setSlotInput("");
  };

  const removeSlot = (date, slot) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability
        .map((item) =>
          item.date === date
            ? {
                ...item,
                slots: item.slots.filter((s) => s !== slot),
              }
            : item,
        )
        .filter((item) => item.slots.length > 0),
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.put("/auth/profile", profile);
      toast.success(data.message || "Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.put("/auth/change-password", passwords);

      toast.success(data.message || "Password updated");

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="settings-page">
            <h1>Doctor Settings</h1>

            <div className="settings-card">
              <h2>Update Profile</h2>

              <form onSubmit={handleProfileUpdate}>
                <input
                  type="text"
                  placeholder="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Consultation Fee"
                  value={profile.fees}
                  onChange={(e) =>
                    setProfile({ ...profile, fees: e.target.value })
                  }
                />

                <div className="availability-slots">
                  <h3>Doctor Calendar Availability</h3>

                  <div className="slot-input-row">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <input
                      type="time"
                      value={slotInput}
                      onChange={(e) => setSlotInput(e.target.value)}
                    />

                    <button
                      type="button"
                      className="add-slot-btn"
                      onClick={addSlot}
                    >
                      Add Slot
                    </button>
                  </div>

                  {profile.availability.map((day) => (
                    <div key={day.date} className="slot-group">
                      <h4>{day.date}</h4>

                      <div className="slot-list">
                        {day.slots.map((slot) => (
                          <div key={slot} className="slot-item">
                            <span>{slot}</span>

                            <button
                              type="button"
                              className="remove-slot-btn"
                              onClick={() => removeSlot(day.date, slot)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit">Save Changes</button>
              </form>
            </div>

            <div className="settings-card">
              <h2>Change Password</h2>

              <form onSubmit={handlePasswordChange}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                />

                <button type="submit">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
