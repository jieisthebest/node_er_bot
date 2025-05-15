# Node-ER Bot

Node-ER Bot is a Node.js-based emergency room triage and diagnosis tool that helps healthcare professionals quickly assess patient data and symptoms to determine if an ER visit is required. It leverages an Express server, EJS templates for dynamic views, and SQLite databases to manage patient records and symptom triage information.

## Overview

Node-ER Bot provides a simple interface where patient information—including age, gender, and a log of symptoms—is displayed. The system then queries a dedicated triage database to retrieve diagnosis results based on the patient's symptoms. With built-in conditional styling, the application highlights cases that require an ER visit, making it easier to prioritize critical cases.

## Features

- **Patient Data Management:** Retrieve and display patient details, including personal information and symptom logs.
- **Dynamic Diagnosis Results:** Query the triage database for matching diagnoses based on patient symptoms.
- **Conditional Alerts:** Important diagnoses (e.g., indicating a necessary ER visit) are highlighted for quick identification.
- **Modern UI:** Uses EJS templates and custom CSS for a clean, dark-themed user interface.
- **Simple Setup:** Easy to deploy with minimal setup using Node.js and SQLite.

## Installation

To set up Node-ER Bot locally, follow these steps:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/jieisthebest/node_er_bot.git
    cd node_er_bot
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```
    This command installs all necessary packages defined in `package.json`.

3. **Configure Databases:**
    Create your SQLite databases (`patient.db` and `triage.db`) as needed, and adjust your configuration if necessary. Ensure your `.gitignore` file is set to ignore the `node_modules` folder.

## Usage

After installing the dependencies and configuring the environment, start the server with:

```bash
npm start


node_er_bot/
├── routes/              # Express route handlers (including diagnosis and patient handling)
├── views/               # EJS templates for generating HTML pages
├── public/              # Static assets (CSS, client-side JavaScript, images)
├── .gitignore           # File to ignore node_modules and other files
├── package.json         # Project configuration and dependencies
└── README.md            # Project documentation
