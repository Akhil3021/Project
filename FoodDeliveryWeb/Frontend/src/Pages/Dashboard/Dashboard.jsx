import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "./Dashboard.css";
import Cookies from "js-cookie";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [orderSummary, setOrderSummary] = useState({});
  const [itemStats, setItemStats] = useState({});
  const [incomeData, setIncomeData] = useState([]);
  const restaurantId = parseInt(Cookies.get("resId"));

  useEffect(() => {
    // Fetch order summary
    axios
      .get(`http://localhost:5083/api/Orders/summary/${restaurantId}`)
      .then((response) => {
        setOrderSummary(response.data);
        console.log("Order Summary", response.data);
      });

    // Fetch item statistics
    axios
      .get(`http://localhost:5083/api/Item/statistics/${restaurantId}`)
      .then((response) => {
        setItemStats(response.data);
        console.log("Item Stats", response.data);
      });

    // Fetch income chart data
    axios
      .get(`http://localhost:5083/api/Orders/chart/${restaurantId}`)
      .then((response) => {
        // Ensure incomeData is an array even if the response is empty
        setIncomeData(Array.isArray(response.data) ? response.data : []);
        console.log("Income", response.data);
      });
  }, []);

  const lineChartData = {
    labels: incomeData.length > 0 ? incomeData.map((d) => d.date) : [], // Avoid calling map if incomeData is empty
    datasets: [
      {
        label: "Total Income",
        data: incomeData.length > 0 ? incomeData.map((d) => d.income) : [],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: itemStats.itemOrders?.map((item) => item.itemName) || [], // Ensure labels exist
    datasets: [
      {
        data: itemStats.itemOrders?.map((item) => item.count) || [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card">
          <h3>Pending Orders</h3>
          <p>{orderSummary.pendingOrders || 0}</p>
        </div>
        <div className="card">
          <h3>Delivered Orders</h3>
          <p>{orderSummary.deliveredOrders || 0}</p>
        </div>
        <div className="card">
          <h3>Out For Delivery Orders</h3>
          <p>{orderSummary.outForDeliveryOrders || 0}</p>
        </div>
        {/* <div className="card">
          <h3>Canceled Orders</h3>
          <p>{orderSummary.canceledOrders || 0}</p>
        </div> */}
        <div className="card">
          <h3>Total Items</h3>
          <p>{itemStats.totalItems || 0}</p>
        </div>
      </div>

      <div className="charts">
        <div className="line-chart">
          <h3>Income Over Time</h3>
          <Line data={lineChartData} />
        </div>
        <div className="pie-chart">
          <h3>Item Order Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
