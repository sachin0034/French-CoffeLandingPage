import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

const Chart = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [chartData, setChartData] = useState([
    { title: "Breakfast", value: 0, color: "#FF6384" },
    { title: "Lunch", value: 0, color: "#36A2EB" },
    { title: "Dinner", value: 0, color: "#FFCE56" },
  ]);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTodayMenu = async () => {
    try {
      const todayDate = getFormattedDate();
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/menu/${todayDate}`
      );

      setMenuItems(response.data.items);

      if (response && response.data.items) {
        let breakfastCount = 0;
        let lunchCount = 0;
        let dinnerCount = 0;

        response.data.items.forEach((item) => {
          if (item.menuType === "Breakfast") breakfastCount++;
          else if (item.menuType === "Lunch") lunchCount++;
          else if (item.menuType === "Dinner") dinnerCount++;
        });

        setChartData([
          { title: "Breakfast", value: breakfastCount, color: "#FF6384" },
          { title: "Lunch", value: lunchCount, color: "#36A2EB" },
          { title: "Dinner", value: dinnerCount, color: "#FFCE56" },
        ]);
      } else {
        console.warn("No meal data found for today.");
        setChartData([
          { title: "Breakfast", value: 0, color: "#FF6384" },
          { title: "Lunch", value: 0, color: "#36A2EB" },
          { title: "Dinner", value: 0, color: "#FFCE56" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#333",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        border: "1px solid #ddd",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Meal Distribution</h3>
      {chartData.every((entry) => entry.value === 0) ? (
        <p style={{ marginTop: "20px", color: "#999" }}>No data available for today.</p>
      ) : (
        <PieChart
          data={chartData}
          radius={40}
          lineWidth={15}
          style={{
            height: "300px",
            margin: "auto",
          }}
          label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
          labelStyle={{
            fontSize: "5px",
            fontWeight: "bold",
            fill: "#333",
          }}
          animate
        />
      )}
    </div>
  );
};

export default Chart;
