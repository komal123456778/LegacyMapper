import networkx as nx

class RiskEngine:
    """
    The AI Layer: Converts raw imports into a mathematical model
    to predict system instability.
    """
    def __init__(self, edges):
        self.G = nx.DiGraph()
        self.G.add_edges_from(edges)

    def calculate_risk_metrics(self):
        if len(self.G) == 0:
            return {"nodes": [], "links": []}

        # Calculate PageRank (Probability of a 'failure' hitting this node)
        pagerank = nx.pagerank(self.G, weight='weight')
        
        # Normalize PageRank for the formula
        max_pr = max(pagerank.values()) if pagerank else 1

        nodes = []
        for node in self.G.nodes():
            in_deg = self.G.in_degree(node)
            out_deg = self.G.out_degree(node)
            pr_score = pagerank.get(node, 0) / max_pr
            
            # THE FORMULA: (In*0.3) + (Out*0.2) + (PR*0.5)
            raw_risk = (in_deg * 0.3) + (out_deg * 0.2) + (pr_score * 0.5)
            normalized_risk = min(10, round(raw_risk + 1, 2)) # 1-10 Scale

            nodes.append({
                "id": node,
                "risk": normalized_risk,
                "inDegree": in_deg,
                "outDegree": out_deg,
                "val": normalized_risk # Used for node size in UI
            })

        links = [{"source": u, "target": v} for u, v in self.G.edges()]
        return {"nodes": nodes, "links": links}

    def get_blast_radius(self, node_id):
        """
        Finds every file that transitively depends on this node.
        If this file breaks, these files break too.
        """
        if node_id not in self.G:
            return []
        # We look for ancestors because edges go Source -> Target (Dependee)
        return list(nx.ancestors(self.G, node_id))