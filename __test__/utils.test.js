const {
  fetchJSON,
  getConstructorsByYear,
  getConstructorResultsByPositions,
  calculateCircuitResults,
  findCircuitWithMaximumPoints,
  getConstructorCircuitWithMaxPoint,
} = require("./../utils");

// Mock the fetch function for testing
global.fetch = jest.fn();

describe("fetchJSON function", () => {
  it("fetches JSON data successfully", async () => {
    // arrange
    const mockResponse = { data: "mock data" };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockResponse });

    // act
    const data = await fetchJSON("endpoint");

    // assert
    expect(data).toEqual(mockResponse);
  });

  it("handles fetch errors gracefully", async () => {
    // arrange
    const error = { message: "API error" };
    fetch.mockRejectedValueOnce(new Error(error.message));

    // act
    const result = fetchJSON("endpoint");

    // assert
    await expect(result).rejects.toThrow(`Fetch error: ${error.message}`);
  });
});

describe("getConstructorsByYear function", () => {
  it("returns a list of constructors for the given year", async () => {
    // arrange
    const mockData = {
      MRData: {
        ConstructorTable: {
          Constructors: [
            { constructorId: "1", name: "Constructor A" },
            { constructorId: "2", name: "Constructor B" },
          ],
        },
      },
    };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData });

    // act
    const result = await getConstructorsByYear(2023);

    // assert
    expect(result).toEqual({
      1: { constructorName: "Constructor A" },
      2: { constructorName: "Constructor B" },
    });
  });

  it("handles missing data gracefully", async () => {
    // arrange
    const mockData = {
      MRData: {
        ConstructorTable: {
          Constructors: null,
        },
      },
    };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData });

    // act
    const result = await getConstructorsByYear(2023);

    // assert
    expect(result).toEqual({});
  });
});

describe("getConstructorResultsByPositions function", () => {
  it("returns constructor results by positions", async () => {
    // arrange
    const mockData1 = {
      MRData: {
        RaceTable: { Races: [{ result: "result1" }] },
      },
    };
    const mockData2 = {
      MRData: {
        RaceTable: { Races: [{ result: "result2" }] },
      },
    };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData1 });
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData2 });

    // act
    const result = await getConstructorResultsByPositions("constructor1", 2);

    // assert
    expect(result).toEqual([[{ result: "result1" }], [{ result: "result2" }]]);
  });

  it("handles missing data gracefully", async () => {
    // arrange
    const mockData1 = {
      MRData: {
        RaceTable: { Races: [] },
      },
    };

    const mockData2 = {
      MRData: {
        RaceTable: { Races: [{ result: "result2" }] },
      },
    };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData1 });
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData2 });

    // act
    const result = await getConstructorResultsByPositions("constructor1", 2);

    // assert
    expect(result).toEqual([[], [{ result: "result2" }]]);
  });
});

describe("calculateCircuitResults function", () => {
  it("calculates circuit results", async () => {
    // arrange
    const constructorResults = [
      [
        {
          Circuit: {
            circuitId: "circuit1",
            circuitName: "Circuit 1",
            Location: { country: "Country 1" },
          },
          Results: [{ points: "10" }],
        },
      ],
      [],
      [
        {
          Circuit: {
            circuitId: "circuit2",
            circuitName: "Circuit 2",
            Location: { country: "Country 2" },
          },
          Results: [{ points: "15" }],
        },
      ],
    ];

    // act
    const result = await calculateCircuitResults(constructorResults);

    // assert
    expect(result).toEqual({
      circuit1: {
        circuitId: "circuit1",
        circuitName: "Circuit 1",
        country: "Country 1",
        totalPoints: 10,
        positionIndex: [1, 0, 0],
      },
      circuit2: {
        circuitId: "circuit2",
        circuitName: "Circuit 2",
        country: "Country 2",
        totalPoints: 15,
        positionIndex: [0, 0, 1],
      },
    });
  });
});

describe("findCircuitWithMaximumPoints function", () => {
  it("finds the circuit with maximum points", () => {
    // arrange
    const circuitResults = {
      circuit1: { totalPoints: 10 },
      circuit2: { totalPoints: 15 },
      circuit3: { totalPoints: 5 },
    };

    // act
    const result = findCircuitWithMaximumPoints(circuitResults);

    // assert
    expect(result).toEqual({ totalPoints: 15 });
  });
});

describe("getConstructorCircuitWithMaxPoint function", () => {
  it("returns constructor and circuit with maximum points", async () => {
    // arrange
    const mockData1 = {
      MRData: {
        RaceTable: {
          Races: [
            {
              Circuit: {
                circuitId: "circuit1",
                circuitName: "Circuit 1",
                Location: { country: "Country 1" },
              },
              Results: [{ points: "15" }],
            },
          ],
        },
      },
    };

    const mockData2 = {
      MRData: {
        RaceTable: {
          Races: [
            {
              Circuit: {
                circuitId: "circuit2",
                circuitName: "Circuit 2",
                Location: { country: "Country 2" },
              },
              Results: [{ points: "10" }],
            },
          ],
        },
      },
    };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData1 });
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockData2 });

    // act
    const result = await getConstructorCircuitWithMaxPoint("constructor1", 2);

    // assert
    expect(result).toEqual({
      circuitId: "circuit1",
      circuitName: "Circuit 1",
      country: "Country 1",
      totalPoints: 15,
      positionIndex: [1, 0],
    });
  });
});
