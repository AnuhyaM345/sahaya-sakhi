#backend/service/talent_logic.py

import math
from typing import Dict

def calculate_similarity(user_vector: Dict[str, float], career_vector: Dict[str, float]) -> float:
    """
    Calculate similarity between user profile vector and career profile vector.
    Uses cosine similarity.
    """
    dot = sum(user_vector[k] * career_vector.get(k, 0) for k in user_vector)
    user_mag = math.sqrt(sum(v**2 for v in user_vector.values()))
    career_mag = math.sqrt(sum(v**2 for v in career_vector.values()))
    if user_mag == 0 or career_mag == 0:
        return 0.0
    return dot / (user_mag * career_mag)
