import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './TransactionDashboard.css'; // Import CSS for styling

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerpage] = useState(5); // Number of transactions per page
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null); // State to store statistics
  const chartRef = useRef(null); // Ref to store chart instance

  useEffect(() => {
    setPerpage(5);
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [selectedMonth, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions?month=${selectedMonth}&page=${currentPage}&perPage=${5}`);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      if(response.data.total<perPage) setPerpage(response.data.total);
      else if(response.data.total%5!=0){
        const n = Math.floor(response.data.total/5);
        if(currentPage<=n){
            setPerpage(5);
        }else setPerpage(response.data.total%5);
      }
      // else{
      //   setPerpage(5);
      // }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/statistics?month=${selectedMonth}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/bar-chart?month=${selectedMonth}`);
      const formattedData = formatBarChartData(response.data);
      renderBarChart(formattedData); // Render bar chart after data fetch
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const formatBarChartData = (data) => {
    const labels = data.priceRangeData.map(item => item.priceRange);
    const values = data.priceRangeData.map(item => item.count);

    return {
      labels: labels,
      values: values
    };
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/transactions?month=${selectedMonth}&search=${searchText}`);
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.totalCount / perPage));
    } catch (error) {
      console.error('Error searching transactions:', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset page number when month changes
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderBarChart = (data) => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy existing chart instance
    }

    const ctx = document.getElementById('barChart').getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Number of Items',
          data: data.values,
          backgroundColor: '#007bff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              generateLabels: function (chart) {
                return [{
                  text: `Bar Chart Stats - ${selectedMonth}`,
                  fillStyle: '#007bff',
                  fontSize: 16,
                  fontStyle: 'bold',
                  fontColor: '#ffffff'
                }];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `Number of Items: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price Range',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Items',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            grid: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  };

  return (
    <div className="transaction-dashboard">
      <h1>Transaction Dashboard</h1>
      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="month-dropdown">
          <label>Select month:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>
  
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.dateOfSale}</td>
              <td><img src={transaction.image} alt={transaction.title} className="transaction-image" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      <div className="page-info">
        <span className="page-number">Page {currentPage}</span>
        <span className="per-page">Items per page: {perPage}</span>
      </div>
       {/* Display statistics if available */}
       {statistics && (
        <div className="statistics">
          <h2>Statistics for {selectedMonth}</h2>
          <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
          <p>Total Number of Sold Items: {statistics.totalSoldItems}</p>
          <p>Total Number of Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      )}

      {/* Display bar chart */}
      <div className="chart-container">
        <canvas id="barChart" width={400} height={300}></canvas>
      </div>
    </div>
  );
};

export default TransactionDashboard;
