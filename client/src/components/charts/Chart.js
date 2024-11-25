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

  const totalMenuItems = chartData.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#fff",
        color: "#333",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        border: "1px solid #ddd",
        width: "90%",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Today Meal Distribution</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <h1>Total Menu: {totalMenuItems}</h1>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {chartData.every((entry) => entry.value === 0) ? (
            <p style={{ marginTop: "20px", color: "#999" }}>
              No data available for today.
            </p>
          ) : (
            <PieChart
              data={chartData}
              radius={40}
              lineWidth={15}
              style={{
                height: "200px",
                width: "200px",
                margin: "auto",
              }}
              //  label={() => `${totalMenuItems}`} // Show total menu count in the center
              labelStyle={{
                fontSize: "16px", // Adjust the font size for small screens
                fontWeight: "bold",
                fill: "#333",
              }}
              animate
            />
          )}
        </div>

        <div
          style={{
            flex: 1,
            marginLeft: "20px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap", // Ensures items wrap if content overflows
            alignItems: "center",
            justifyContent: "flex-start", // Aligns items to the left
            gap: "10px", // Adds spacing between items
          }}
        >
          {chartData.map((data, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: data.color,
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              ></div>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {data.title}: {data.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;
