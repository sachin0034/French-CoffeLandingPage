// import React from "react";
// import {
//   XYPlot,
//   LineSeries,
//   XAxis,
//   YAxis,
//   VerticalGridLines,
//   HorizontalGridLines,
// } from "react-vis";
// import "react-vis/dist/style.css";

// const Chart = () => {

//   const data = [
//     { x: 0, y: 0 },
//     { x: 1, y: 2 },
//     { x: 2, y: 4 },
//     { x: 3, y: 6 },
//   ];

//   return (
//     <div>
//       <h3>Simple Line Chart</h3>
//       {/* First Chart */}
//       <XYPlot height={300} width={300}>
//         <LineSeries
//           data={[
//             { x: 0, y: 0 },
//             { x: 1, y: 1 },
//             { x: 2, y: 4 },
//             { x: 3, y: 9 },
//           ]}
//         />
//       </XYPlot>

//       {/* Second Chart */}
//       <div style={{ marginTop: "15px" }}>
//         <h3>Chart with Grid Lines and Multiple Series</h3>
//         <XYPlot height={300} width={300}>
//           {/* Grid Lines */}
//           <VerticalGridLines />
//           <HorizontalGridLines />

//           {/* Axes */}
//           <XAxis />
//           <YAxis />

//           {/* Multiple Line Series */}
//           <LineSeries data={data} color="red" />
//           <LineSeries
//             data={[
//               { x: 0, y: 0 },
//               { x: 1, y: 3 },
//               { x: 2, y: 5 },
//               { x: 3, y: 7 },
//             ]}
//             color="purple"
//           />
//           <LineSeries
//             data={[
//               { x: 0, y: 1 },
//               { x: 1, y: 2 },
//               { x: 2, y: 3 },
//               { x: 3, y: 5 },
//             ]}
//             color="yellow"
//           />
//         </XYPlot>
//       </div>
//     </div>
//   );
// };

// export default Chart;


import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from "react-vis";
import "react-vis/dist/style.css";

const Chart = () => {
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 25 },
    { x: 4, y: 30 },
    { x: 5, y: 45 },
  ];

  return (
    <div
    style={{
      backgroundColor: "#f5f5f5", // Light blackish-white background
      padding: "5px",
      borderRadius: "10px",
      border: "1px solid #bbb", // Border around the chart container
      overflow: "hidden", // Prevents overflow of the chart area
    }}
    >
      <h3 style={{ color: "#333", textAlign: "center" }}>Bar Chart Example</h3>
      <XYPlot height={300} width={300} style={{ backgroundColor: "#f5f5f5" }}>
        <VerticalGridLines style={{ stroke: "#ddd" }} />
        <HorizontalGridLines style={{ stroke: "#ddd" }} />
        <XAxis
          style={{
            line: { stroke: "#555" }, // Blackish border for axis line
            ticks: { stroke: "#555" },
            text: { fill: "#333" }, // Dark text for labels
          }}
        />
        <YAxis
          style={{
            line: { stroke: "#555" }, // Blackish border for axis line
            ticks: { stroke: "#555" },
            text: { fill: "#333" }, // Dark text for labels
          }}
        />
        <VerticalBarSeries
          data={data}
          color="#fff" // White bars
          style={{
            stroke: "#555", // Blackish border around bars
            strokeWidth: "4px",
          }}
        />
      </XYPlot>
    </div>
  );
};

export default Chart;
