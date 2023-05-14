import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { saveAs } from 'file-saver';

const FrequencyCounter = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch(
      'https://www.terriblytinytales.com/test.txt'
    );
    const text = await response.text();
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter((word) => word !== '');

    const frequencies = {};
    words.forEach((word) => {
      if (frequencies[word]) {
        frequencies[word] += 1;
      } else {
        frequencies[word] = 1;
      }
    });

    const sortedFrequencies = Object.entries(frequencies).sort(
      (a, b) => b[1] - a[1]
    );

    setData(sortedFrequencies.slice(0, 20));
  };

  const handleExport = () => {
    const csvData = data.map((entry) => `${entry[0]},${entry[1]}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'histogram.csv');
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {data && (
        <>
          <Plot
            data={[
              {
                x: data.map((entry) => entry[0]),
                y: data.map((entry) => entry[1]),
                type: 'bar',
              },
            ]}
            layout={{
              width: 800,
              height: 400,
              title: 'Top 20 Most Occurring Words',
              xaxis: { title: 'Word' },
              yaxis: { title: 'Frequency' },
            }}
          />
          <button onClick={handleExport}>Export</button>
        </>
      )}
    </div>
  );
};

export default FrequencyCounter;
