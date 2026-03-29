# Legacy Mapper (for Enterprise Software Modernization)
LegacyMapper is an AI-powered tool that analyzes legacy codebases to map out dependencies, visualize relationships, and identify risk metrics. It helps developers understand complex code structures, assess potential impacts of changes, and maintain enterprise-level software systems through an interactive web interface.

# LegacyMapper

An AI-powered dependency mapping tool for analyzing legacy codebases and identifying risk metrics.

## Features

- Enterprise code analysis
- Dependency graph visualization
- Risk assessment and impact analysis
- Interactive web interface

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd LegacyMapper
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running the Project

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```
   The backend API will be available at `http://localhost:8000`

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the interface to scan repositories and analyze dependencies
3. View risk metrics and impact analysis

## API Endpoints

- `GET /scan?path=<absolute-path>` - Scan a repository
- `GET /impact?node_id=<node-id>` - Get impact analysis for a node

## Note

For Python file folders it analyzes, upcoming changes will be updated in the project to enhance analysis capabilities and add new features.
