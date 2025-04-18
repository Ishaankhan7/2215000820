const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const numberWindow = [];

const typeToURL = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return Number((sum / arr.length).toFixed(2));
}

app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;
  const url = typeToURL[type];

  if (!url) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  try {
    const windowPrevState = [...numberWindow];
    const response = await axios.get(url);
    const newNumbers = response.data.numbers;

    for (const num of newNumbers) {
      if (!numberWindow.includes(num)) {
        numberWindow.push(num);
        if (numberWindow.length > 10) {
          numberWindow.shift(); 
        }
      }
    }

    res.json({
      windowPrevState,
      windowCurrState: [...numberWindow],
      numbers: newNumbers,
      avg: calculateAverage(numberWindow)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch numbers' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
