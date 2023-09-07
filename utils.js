const BASE_URL = "https://ergast.com/api/f1";

async function fetchJSON(endpoint) {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
}

// get a list of 2023 constructors by default
async function getConstructorsByYear(year = 2023) {
  const data = await fetchJSON(`${year}/constructors.json`);
  const constructors = data?.MRData?.ConstructorTable?.Constructors ?? [];
  const result = {};
  constructors.forEach(({ constructorId, name: constructorName }) => {
    result[constructorId] = { constructorName };
  });
  return result;
}

// get a list of constructor results arranged by position or index
async function getConstructorResultsByPositions(constructorId, positionRange) {
  // parallelize fetching constructor results by position
  const promises = [];
  for (let position = 1; position <= positionRange; position++) {
    promises.push(
      await fetchJSON(
        `constructors/${constructorId}/results/${position}.json?limit=400`
      )
    );
  }
  const datas = await Promise.all(promises);
  let result = datas.map((data) => {
    return data?.MRData?.RaceTable?.Races ?? [];
  });
  return result;
}

// calculate totalPoints accumulated per circuit
async function calculateCircuitResults(constructorResults) {
  const circuitResults = {};
  for (let position = 1; position <= constructorResults.length; position++) {
    const constructorResultsByPosition = constructorResults[position - 1];
    if (constructorResultsByPosition.length > 0) {
      constructorResultsByPosition.forEach((race) => {
        const {
          Circuit: {
            circuitId,
            circuitName,
            Location: { country },
          },
          Results: [{ points }],
        } = race;
        if (!circuitResults[circuitId]) {
          const fill = new Array(constructorResults.length).fill(0);
          fill[position - 1] += 1;
          circuitResults[circuitId] = {
            circuitId,
            circuitName,
            country,
            totalPoints: +points,
            positionIndex: [...fill],
          };
        } else {
          circuitResults[circuitId].totalPoints += +points;
          circuitResults[circuitId].positionIndex[position - 1] += 1;
        }
      });
    }
  }
  return circuitResults;
}

// find circuit with maximumpoints
function findCircuitWithMaximumPoints(circuitResults) {
  let maxPoints = 0;
  let bestResult = {};

  for (let circuitId in circuitResults) {
    let { totalPoints } = circuitResults[circuitId];
    if (totalPoints > maxPoints) {
      bestResult = { ...circuitResults[circuitId] };
      maxPoints = totalPoints;
    }
  }
  return bestResult;
}

// get a constructor and its circuit with Max accumulated point
async function getConstructorCircuitWithMaxPoint(
  constructorId,
  numberOfPositions
) {
  let constructorResults = await getConstructorResultsByPositions(
    constructorId,
    numberOfPositions
  );

  const circuitResults = await calculateCircuitResults(constructorResults);

  const circuitWithMaximumPoints = findCircuitWithMaximumPoints(circuitResults);

  return circuitWithMaximumPoints;
}

module.exports = {
  fetchJSON,
  getConstructorsByYear,
  getConstructorResultsByPositions,
  calculateCircuitResults,
  findCircuitWithMaximumPoints,
  getConstructorCircuitWithMaxPoint,
};
