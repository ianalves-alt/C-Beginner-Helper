# C Programming Project Generator

This project utilizes Google Generative AI to create beginner-level C programming projects with a slight increase in difficulty based on the previous output. Each time you run the program, it generates a new project prompt that builds on the last one, helping you to progressively challenge your programming skills.

## Features

- Generates a C programming project prompt with a focus on slight difficulty increase.
- Saves the last generated output to a JSON file for reference in future runs.
- Outputs a project description, improvement goals, and example program usage.

## Technologies Used

- Node.js
- Google Generative AI API
- dotenv for environment variable management
- fs/promises for file operations

## Requirements

You will need the following tools installed:

- **Node.js** version **20.11.0** or higher
- **npm** version **7.0.0** or higher

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ianalves-alt/C-Beginner-Helper.git

2. **Instal dependencies**:
   ```bash
   npm install @google/generative-ai dotenv

3. **Create a .env.local file**: In the root of the project, create a .env.local file and add your Google Generative AI API key:
   ```bash
   API_KEY=your_google_api_key
## Usage

1. **Run the main file
   ```bash
   node Cproj
2. **Output**: The program will log the generate C project description on the console. The last output will also be saved in lastOutput.json, which is used as context for the same run

## Example
The generated output wiil look something like this

