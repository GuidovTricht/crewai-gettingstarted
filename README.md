## 🚀 Quick Start

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
