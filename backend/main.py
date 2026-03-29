from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from analyzer import EnterpriseCodeAnalyzer
from graph_engine import RiskEngine

app = FastAPI(title="AI Dependency Mapper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global store for current session graph
current_engine = None

@app.get("/scan")
async def scan_repository(path: str = Query(..., description="Absolute path to local repo")):
    global current_engine
    analyzer = EnterpriseCodeAnalyzer(path)
    edges = analyzer.analyze()
    current_engine = RiskEngine(edges)
    return current_engine.calculate_risk_metrics()

@app.get("/impact")
async def get_impact(node_id: str):
    if not current_engine:
        return []
    return current_engine.get_blast_radius(node_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)