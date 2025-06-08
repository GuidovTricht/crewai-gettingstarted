from fastapi import FastAPI
from crew import SeoCrew

app = FastAPI()

@app.post("/run_crew/")
async def run_crew_endpoint(inputs: dict = None):
    try:
        result = SeoCrew().crew().kickoff(inputs=inputs)
        return {"result": result}
    except ValueError as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Hello World"}
