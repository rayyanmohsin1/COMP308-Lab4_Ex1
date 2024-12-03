import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [inputData, setInputData] = useState({
        sepal_length: '',
        sepal_width: '',
        petal_length: '',
        petal_width: '',
        epochs: '100', // Default value
        learningRate: '0.06', // Default value
    });

    const [predictions, setPredictions] = useState([]); // Array to store all test results
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        try {
            // Send POST request to the backend
            const response = await axios.post('/api/run', inputData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Append new prediction set to the predictions array
            setPredictions((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Error making prediction:', err);
            setError('Prediction failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>AI Prediction App</h1>
            <form className="App-form" onSubmit={handleSubmit}>
                <label>Sepal Length:</label>
                <input
                    type="number"
                    name="sepal_length"
                    value={inputData.sepal_length}
                    onChange={handleChange}
                    required
                />
                <label>Sepal Width:</label>
                <input
                    type="number"
                    name="sepal_width"
                    value={inputData.sepal_width}
                    onChange={handleChange}
                    required
                />
                <label>Petal Length:</label>
                <input
                    type="number"
                    name="petal_length"
                    value={inputData.petal_length}
                    onChange={handleChange}
                    required
                />
                <label>Petal Width:</label>
                <input
                    type="number"
                    name="petal_width"
                    value={inputData.petal_width}
                    onChange={handleChange}
                    required
                />
                <label>Epochs:</label>
                <input
                    type="number"
                    name="epochs"
                    value={inputData.epochs}
                    onChange={handleChange}
                    required
                />
                <label>Learning Rate:</label>
                <input
                    type="number"
                    step="0.01"
                    name="learningRate"
                    value={inputData.learningRate}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Predict</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {predictions.length > 0 && (
                <div>
                    <h2>Prediction Results</h2>
                    <table className="App-table">
                        <thead>
                            <tr>
                                <th>Test</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {predictions.map((predictionSet, index) => (
                                <tr key={index}>
                                    <td>Test {index + 1}</td>
                                    <td>{predictionSet[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2 className="App-species-title">Definition of Values for Species</h2>
                    <table className="App-table">
                        <thead>
                            <tr>
                                <th>Species</th>
                                <th>Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>setosa</td>
                                <td>1, 0, 0</td>
                            </tr>
                            <tr>
                                <td>virginica</td>
                                <td>0, 1, 0</td>
                            </tr>
                            <tr>
                                <td>versicolor</td>
                                <td>0, 0, 1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
