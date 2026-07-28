import sys
import json
import random

def predict_career(responses):
    categories = ["Engineering", "Medical", "Aviation", "Law", "Arts", "Paramedical"]
    return random.choice(categories)  # Replace with actual ML model logic

if __name__ == "__main__":
    responses = json.loads(sys.argv[1])
    print(predict_career(responses))
