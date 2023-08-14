import React, { useState } from 'react';
import './styles/App.css';
import UploadForm from './components/UploadForm';
import ColumnSelector from './components/ColumnSelector';
import LineChart from './components/LineChart'; // Import the LineChart component
import BubbleChart from './components/BubbleChart'; // Import the BubbleChart component
import BollingerChart from './components/BollingerChart';

function App() {
  const [data, setData] = useState([]);
  const [columnArray, setColumnArray] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // Track selected columns



  const handleColumnSelect = (selected) => {
    setSelectedColumns(selected);
  };

  const handleDataChange = (newData, newColumns, values) => {
    setData(newData);
    setColumnArray(newColumns);
    setValues(values);
    setSelectedColumns([]); // Reset selected columns when new data is loaded
  };

  const dateColumnNames = selectedColumns.map(col => col.toLowerCase());

  const hasDateColumn = dateColumnNames.includes('date');

  return (
    <div className="App">
      <h1>CSV Data Visualizer</h1>
      <UploadForm onDataChange={handleDataChange} onColumnSelect={handleColumnSelect} />

      {data.length > 0 && (
        <div>
          <ColumnSelector headers={data.length > 0 ? Object.keys(data[0]) : []}
            onColumnSelect={handleColumnSelect} />

          <h3>Dataset</h3>
          <table style={{
            border: '2px solid black', borderRadius: 5, marginBottom: 10,
            borderCollapse: 'collapse',
            borderSpacing: 0,
            maxHeight: '200px', overflowY: 'scroll',
            backgroundColor: '#f5f5f5',
            width: `${columnArray.length * 110}px`,
            display: 'block'
          }}>
            <thead>
              <tr>
                {columnArray.map((column, index) => (
                  <th key={index} style={{ border: '1px solid black', padding: '5px' }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{
                      border: '1px solid black', padding: '5px',
                      textAlign: 'center'
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='charts'>
            <div className='chart-container'>
              {selectedColumns.length > 0 && <LineChart data={data} selectedColumns={selectedColumns} />}
            </div>
            <div className='chart-container'>
              {data.length > 0 && selectedColumns.length >= 3 && (
                <BubbleChart data={data} selectedColumns={selectedColumns} />
              )}
            </div>
            <div className='chart-container'>
              {data.length > 0 && selectedColumns.length >= 2 && hasDateColumn && (
                <BollingerChart data={data} selectedColumns={selectedColumns} />
              )}
            </div>
          </div>



        </div>
      )}
    </div>
  );
}

export default App;
