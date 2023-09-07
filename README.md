# F1 Constructor Performance Analyzer

This is a JavaScript application that analyzes the performance of Formula 1 constructors in the 2023 season to determine which circuit throughout history they have performed best at.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Prerequisites

- **Node.js**: This application requires Node.js. You will need to have Node.js installed on your system to run the application. We recommend using Node.js version 18 or later. You can download it from [nodejs.org](https://nodejs.org/).

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/kayphaz007/f1-constructor-performance-analyzer.git
```

2. Navigate to the project directory:

```bash
cd f1-constructor-performance-analyzer
```

3. Install the required dependencies:

```bash
npm install
```

## Usage

The application consists of four main files:

- `utils.js`: Contains utility functions for fetching data and analyzing F1 constructor performance.
- `index.js`: The main script that fetches data for the 2023 F1 constructors and analyzes their performance.
- `utils.test.js`: Test cases for the utility functions.
- `answer.txt`: Contains the output from running index.js.

To run the application,

- To output the result to the file `answer.txt`, run

```bash
npm run start
```

- To output the result to the terminal

```bash
npm run log
```

The result will be displayed in the console, showing which circuit each 2023 constructor has performed best at in the history of Formula 1.

## Testing

To run the test cases for the utility functions, use the following command:

```bash
npm test
```
