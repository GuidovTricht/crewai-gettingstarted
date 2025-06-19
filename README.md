# 🚀 Quick Start

## Run CrewAI Python application
```bash
# Clone the repository
git clone https://github.com/GuidovTricht/crewai-gettingstarted.git

# Create venv
python -m venv .venv

# Activate venv
.\.venv\Scripts\activate

# Install dependencies
python -m pip install -r .\requirements.txt

# Set up environment
cp .env.example .env
# Add your OpenAI API key to .env

# Start the server
uvicorn main:app --reload --port 8000

```

## Run the Chat UI
```bash
# Navigate to the /ui folder
cd ui

# Instal NPM packages
npm ci

# Start React application
npm run dev

```