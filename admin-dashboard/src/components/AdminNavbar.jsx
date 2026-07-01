const AdminNavbar = () => {
  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left"></div>

      <div className="navbar-right">
        <span>Welcome, {adminName}</span>
      </div>
    </header>
  );
};

export default AdminNavbar;
