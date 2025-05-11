import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [visibleLogs, setVisibleLogs] = useState({});
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
            )}
          </li>
        ))}
      </ul>

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
