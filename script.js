// Get the SVG element
const svg = d3.select('.line-chart');

// Define your data points (for example purposes)
const data = [
    { month: 'January', value: 50 },
    { month: 'February', value: 70 },
    { month: 'March', value: 60 },
    { month: 'April', value: 80 },
    { month: 'May', value: 75 },
    { month: 'June', value: 90 },
    { month: 'July', value: 85 },
    { month: 'August', value: 95 },
    { month: 'September', value: 85 },
    { month: 'October', value: 100 },
    { month: 'November', value: 90 },
    { month: 'December', value: 95 }
];

// Set up dimensions and margins
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = svg.node().clientWidth - margin.left - margin.right;
const height = svg.node().clientHeight - margin.top - margin.bottom;

// Create scales
const xScale = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height, 0]);

// Create line generator
const line = d3.line()
    .x(d => xScale(d.month) + xScale.bandwidth() / 2)
    .y(d => yScale(d.value));

// Append a group element to SVG
const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Append x-axis
g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

// Append y-axis
g.append('g')
    .call(d3.axisLeft(yScale));

// Append the line path
g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#E94560')
    .attr('stroke-width', 2)
    .attr('d', line);

// Function to show dashboard in grid layout
function showDashboard() {
    document.querySelector('.dashboard').style.display = 'grid';
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
}

// Function to show sections (except dashboard) in block layout
function showSection(sectionId) {
    document.querySelectorAll('.section, .dashboard').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Navigation and dashboard box click functionality
document.querySelectorAll('.nav-links a, .dropdown-content a, .dashboard-box').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        
        const sectionId = item.getAttribute('data-section');
        if (sectionId === 'dashboard') {
            showDashboard();
        } else if (sectionId) {
            showSection(sectionId);
        } else if (item.id === 'login-link' || item.id === 'login-link-dropdown' || item.id === 'signup-link' || item.id === 'signup-link-dropdown') {
            alert(item.id.includes('login') ? 'Login Clicked' : 'Sign Up Clicked');
        } else {
            showDashboard(); // Default to dashboard for home or unrecognized clicks
        }
    });
});

// Show dashboard on initial load
showDashboard();

document.addEventListener('DOMContentLoaded', () => {
    fetch('/water-usage')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#water-usage-table tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.ID}</td>
                    <td>${row.BorewellID}</td>
                    <td>${row.WaterUsed}</td>
                    <td>${row.DateUsed}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

