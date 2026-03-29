import ast
import os
from pathlib import Path

class EnterpriseCodeAnalyzer:
    """
    The Brain: Uses Abstract Syntax Trees to find true code relationships
    without executing the code (Static Analysis).
    """
    def __init__(self, root_path):
        self.root_path = Path(root_path)
        self.edges = [] # List of (source_file, target_file)

    def analyze(self):
        for path in self.root_path.rglob('*.py'):
            if 'venv' in str(path) or '__pycache__' in str(path):
                continue
            
            relative_path = str(path.relative_to(self.root_path))
            self._extract_dependencies(path, relative_path)
        return self.edges

    def _extract_dependencies(self, file_path, rel_name):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                node = ast.parse(f.read())

            for subnode in ast.walk(node):
                # Handles 'import os'
                if isinstance(subnode, ast.Import):
                    for alias in subnode.names:
                        self.edges.append((rel_name, f"{alias.name}.py"))
                
                # Handles 'from module import function'
                elif isinstance(subnode, ast.ImportFrom):
                    if subnode.module:
                        target = subnode.module.replace('.', '/') + ".py"
                        self.edges.append((rel_name, target))
                        
        except Exception as e:
            print(f"Skipping {rel_name} due to parse error: {e}")