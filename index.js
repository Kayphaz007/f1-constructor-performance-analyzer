const {
  getConstructorsByYear,
  getConstructorCircuitWithMaxPoint,
} = require("./utils");

const numberOfPositions = 10;
const year = 2023;

(async () => {
  const result = await getConstructorsByYear(year);
  const constructorIds = Object.keys(result);

  //   Parallelize fetching best results for all constructors
  const promises = constructorIds.map((constructorId) => {
    return getConstructorCircuitWithMaxPoint(constructorId, numberOfPositions);
  });
  const listOfConstructorBestPerformances = await Promise.all(promises);

  //   assign best circuit performance to the corresponding constructors
  constructorIds.forEach((constructorId, index) => {
    result[constructorId].bestCircuitPerformance =
      listOfConstructorBestPerformances[index];
  });
  console.log(
    `For each of the constructors in the ${year} F1 season, which circuit througout history have they performed best at?`
  );
  console.log("Constructor Name           Circuit Name");
  for (let constructor in result) {
    console.log(
      `${result[constructor].constructorName}     ---->    ${
        result[constructor]?.bestCircuitPerformance?.circuitName ?? "None"
      }`
    );
  }
  // TODO: output result to a answer.txt file
})();
