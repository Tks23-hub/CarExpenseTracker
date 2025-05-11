import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [visibleLogs, setVisibleLogs] = useState({});
  const [logFormData, setLogFormData] = useState({});
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    year: "",
    color: "",
    license_plate: "",
  });

  const token = localStorage.getItem("token");

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cars");
    }
  };

  useEffect(() => {
    if (token) {
      const fetchCars = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/cars", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCars(res.data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch cars");
        }
      };

      fetchCars();
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  //////////////////////////////////////////////////////////////////
  // CAR FUNCTIONS
  //////////////////////////////////////////////////////////////////

  // Function to Add a Car
  const handleAddCar = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/cars/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        type: "",
        model: "",
        year: "",
        color: "",
        license_plate: "",
      });

      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    }
  };
  // Function to Delete a Car
  const handleDeleteCar = async (carId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cars/delete/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete car");
    }
  };

  //////////////////////////////////////////////////////////////
  // LOG FUNCTIONS
  //////////////////////////////////////////////////////////////

  // Function to Toggle Logs Visibility
  const toggleLogs = async (carId) => {
    if (visibleLogs[carId]) {
      // Hide logs if already visible
      setVisibleLogs((prev) => {
        const newLogs = { ...prev };
        delete newLogs[carId];
        return newLogs;
      });
    } else {
      try {
        const res = await axios.get(`http://localhost:5000/api/logs/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVisibleLogs((prev) => ({
          ...prev,
          [carId]: res.data,
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch logs");
      }
    }
  };
  // Function to Handle Log Form Input Change
  const handleLogInputChange = (carId, e) => {
    const { name, value } = e.target;

    setLogFormData((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        [name]: value,
      },
    }));
  };
  // Function to Add a Log
  const handleAddLog = async (carId, e) => {
    e.preventDefault();

    const form = logFormData[carId];
    if (!form?.log_type) {
      return setError("Log type is required.");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/logs/add",
        {
          car_id: carId,
          log_type: form.log_type,
          description: form.description || "",
          cost: form.cost || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear form
      setLogFormData((prev) => ({
        ...prev,
        [carId]: { log_type: "", description: "", cost: "" },
      }));

      // Refresh logs
      toggleLogs(carId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add log");
    }
  };

  return (
    <div>
      <h2>Your Cars</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {cars.length === 0 && !error && <p>You don’t have any cars yet.</p>}

      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <strong>
              {car.type} {car.model}
            </strong>{" "}
            ({car.year}) - {car.color}, Plate: {car.license_plate}
            <button
              onClick={() => handleDeleteCar(car.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
            <button
              onClick={() => toggleLogs(car.id)}
              style={{ marginLeft: "10px" }}
            >
              {visibleLogs[car.id] ? "Hide Logs" : "View Logs"}
            </button>
            {visibleLogs[car.id] && (
              <>
                <ul>
                  {visibleLogs[car.id].length === 0 ? (
                    <li>No logs found for this car.</li>
                  ) : (
                    visibleLogs[car.id].map((log) => (
                      <li key={log.id}>
                        <strong>{log.log_type.toUpperCase()}</strong> -{" "}
                        {log.description} | Cost: ${log.cost} | Date:{" "}
                        {new Date(log.log_date).toLocaleString()}
                      </li>
                    ))
                  )}
                </ul>

                <form onSubmit={(e) => handleAddLog(car.id, e)}>
                  <h4>Add Log</h4>
                  <select
                    name="log_type"
                    value={logFormData[car.id]?.log_type || ""}
                    onChange={(e) => handleLogInputChange(car.id, e)}
                  >
                    <option value="">Select Type</option>
                    <option value="gas">Gas</option>
                    <option value="repair">Repair</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="tires">Tires</option>
                    <option value="water">Water</option>
                  </select>
                  <br />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={logFormData[car.id]?.description || ""}
                    onChange={(e) => handleLogInputChange(car.id, e)}
                  />
                  <br />
                  <input
                    type="number"
                    name="cost"
                    placeholder="Cost"
                    value={logFormData[car.id]?.cost || ""}
                    onChange={(e) => handleLogInputChange(car.id, e)}
                  />
                  <br />
                  <button type="submit">Add Log</button>
                </form>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 🟢 Moved outside of the map */}
      <h3>Add New Car</h3>
      <form onSubmit={handleAddCar}>
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="text"
          name="license_plate"
          placeholder="License Plate"
          value={formData.license_plate}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
}
export default Dashboard;
