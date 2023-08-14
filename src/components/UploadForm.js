import React, { useState } from 'react';
import Papa from 'papaparse';
import ColumnSelector from './ColumnSelector.js';

function UploadForm({ onDataChange }) {
    const [data, setData] = useState([]);
    const [columnArray, setColumnArray] = useState([]);
    const [values, setValues] = useState([]);

    // const handleColumnChange = (event) => {
    //     const selectedColumns = []
    //     const checkboxes = document.querySelectorAll('input[name="column"]');
    //     checkboxes.forEach((checkbox) => {
    //         console.log(checkbox.value);
    //         if (checkbox.checked) {
    //             selectedColumns.push(checkbox.value);
    //         }
    //     });

    //     if (selectedColumns.length >= 2) {
    //         onColumnSelect(selectedColumns); // Pass selected columns to App.js
    //     }
    // };

    // const handleColumnChange = (event) => {
    //     const selectedColumns = Array.from(event.target.querySelectorAll('input:checked')).map(input => input.value);
    //     onColumnSelect(selectedColumns);
    // };

    const handleFileChange = (event) => {
        if (!event.target.files[0]) {
            alert('Please select a file to upload.');
            return;
        }
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const columnArray = [];
                const valuesArray = [];
                results.data.map((d) => {
                    columnArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                setData(results.data);
                setColumnArray(columnArray[0]);
                setValues(valuesArray);
                onDataChange(results.data, columnArray[0], valuesArray);

            },
        });
    };



    return (
        <div>
            <h2>Upload CSV File</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
        </div >

    );
}

export default UploadForm;
