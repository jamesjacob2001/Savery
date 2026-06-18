#!/usr/bin/env python3
"""Convert recipe CSV to JSON with array fields for ingredients and instructions."""

import csv
import json
import re
import sys
from typing import Optional


def parse_cost(cost_str: str) -> float:
    match = re.search(r"[\d.]+", cost_str or "")
    return float(match.group()) if match else 0.0


def csv_row_to_recipe(row: dict, recipe_id: int) -> dict:
    ingredients = [part.strip() for part in row["ingredients"].split("|") if part.strip()]
    instructions = [part.strip() for part in row["instructions"].split("|") if part.strip()]

    return {
        "id": recipe_id,
        "name": row["recipe_name"],
        "ingredients": ingredients,
        "instructions": instructions,
        "cost": parse_cost(row["cost"]),
        "cost_currency": "USD",
        "preparation_time": int(row["preparation_time"]),
        "protein": float(row["protein"]),
        "cuisine": row["cuisine"],
        "calories": int(row["calories"]),
        "dietary_restrictions": row["dietary_restrictions"],
        "spice_level": row["spice_level"],
        "meal_type": row["meal_type"],
        "rating": float(row["rating"]),
        "serving_size": int(row["serving_size"]),
        "source_url": row["source_url"],
        "created_at": row["created_at"],
        "image_url": row["image_url"],
    }


def load_recipes(csv_path: str) -> list[dict]:
    with open(csv_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return [csv_row_to_recipe(row, i + 1) for i, row in enumerate(rows)]


def write_json(path: str, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def convert_csv_to_json(csv_path: str, mongo_json_path: str, api_json_path: Optional[str] = None) -> int:
    recipes = load_recipes(csv_path)

    # MongoDB Compass imports one document per top-level array item.
    write_json(mongo_json_path, recipes)

    if api_json_path:
        write_json(api_json_path, {"recipes": recipes})

    return len(recipes)


if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "data/recipes.csv"
    mongo_json_path = sys.argv[2] if len(sys.argv) > 2 else "data/recipes.json"
    api_json_path = sys.argv[3] if len(sys.argv) > 3 else "data/recipes.api.json"

    count = convert_csv_to_json(csv_path, mongo_json_path, api_json_path)
    print(f"Wrote {count} recipe documents to {mongo_json_path}")
    print(f"Wrote API wrapper to {api_json_path}")
