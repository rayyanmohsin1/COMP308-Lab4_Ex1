const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const iris = require('../../iris.json');
const irisTesting = require('../../iris-testing.json');

exports.trainAndPredict = async function (req, res) {
    console.log('Received Input:', req.body); // Debug log to check input data

    const { sepal_length, sepal_width, petal_length, petal_width } = req.body;

    if (!sepal_length || !sepal_width || !petal_length || !petal_width) {
        console.log('Missing required fields:', req.body); // Log missing fields
        return res.status(400).send({ error: 'All input fields are required.' });
    }

    try {
        // Convert training data to tensors
        const trainingData = tf.tensor2d(
            iris.map(item => [item.sepal_length, item.sepal_width, item.petal_length, item.petal_width])
        );
        const outputData = tf.tensor2d(
            iris.map(item => [
                item.species === 'setosa' ? 1 : 0,
                item.species === 'virginica' ? 1 : 0,
                item.species === 'versicolor' ? 1 : 0
            ])
        );

        // Convert user input to a tensor
        const testingData = tf.tensor2d([
            [parseFloat(sepal_length), parseFloat(sepal_width), parseFloat(petal_length), parseFloat(petal_width)]
        ]);

        // Build the model
        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
        model.compile({
            optimizer: tf.train.adam(0.06),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        // Train the model
        await model.fit(trainingData, outputData, { epochs: 100 });

        // Make predictions based on user input
        const results = model.predict(testingData);
        const predictionArray = await results.array();

        // Map predictions to species
        const predictions = predictionArray.map(row => {
            const maxIndex = row.indexOf(Math.max(...row));
            return ['setosa', 'virginica', 'versicolor'][maxIndex];
        });

        // Send predictions back to the frontend
        res.status(200).send(predictions);
    } catch (error) {
        console.error('Error during training/prediction:', error);
        res.status(500).send({ error: 'Prediction failed.' });
    }
};
