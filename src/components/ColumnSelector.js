import React from 'react';
import { useState } from 'react';
import '../styles/ColumnSelector.css'

function ColumnSelector({ headers, onColumnSelect }) {

    const [selectedColumns, setSelectedColumns] = useState([]); // Track selected columns

    const handleCheckboxChange = (event) => {
        const columnName = event.target.value;
        if (event.target.checked) {
            setSelectedColumns((prevSelected) => [...prevSelected, columnName]);
        } else {
            setSelectedColumns((prevSelected) => prevSelected.filter((col) => col !== columnName));
        }
    };

    return (
        <div>
            <h2>Select Columns</h2>
            <form>
                {headers.map((header) => (
                    <div key={header}>
                        <input
                            type="checkbox"
                            id={header}
                            name={header}
                            value={header}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor={header}>{header}</label>
                    </div>
                ))}
            </form>
            <button onClick={() => onColumnSelect(selectedColumns)}>Confirm</button>
        </div>
    );

}

export default ColumnSelector;
