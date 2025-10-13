# Todo App

A simple Todo app, built with React Native for the frontend, and Python Flask for the backend. The app allows users to create, read, update, and delete todo items.

## Features

- Dockerized application using Podman for easy deployment
- RESTful API with Flask
- React Native frontend for cross-platform mobile support

## Requirements

- Podman
- Podman-Compose

> Note: Ensure that Podman and Podman-Compose are installed on your system. Refer to the [Podman installation guide](https://podman.io/getting-started/installation) for instructions.

> Note: This project uses Podman instead of Docker for containerization. Make sure to have Podman installed and configured on your system.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sammmms/devops-uts.git
   cd devops-uts
   ```

2. Build and run the Podman containers:

   ```bash
   podman-compose up --build
   ```

3. Access the app:
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:5001`
