from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np

app = Flask(__name__)

# Career fields
career_fields = ["Engineering", "Medical", "Paramedical", "Arts", "Aviation"]

# Define Neural Network Model
class CareerPredictor(nn.Module):
    def __init__(self):
        super(CareerPredictor, self).__init__()
        self.fc1 = nn.Linear(5, 10)
        self.fc2 = nn.Linear(10, 5)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# Load trained model
model = CareerPredictor()
model.load_state_dict(torch.load("career_model.pth"))  # Save this model after training
model.eval()

# Prediction function
def predict_career(user_responses):
    input_tensor = torch.tensor([user_responses], dtype=torch.float32)
    output = model(input_tensor)
    predicted_index = torch.argmax(output).item()
    return career_fields[predicted_index]

# API Endpoint to get career prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_responses = data.get("responses", [])
    if len(user_responses) != 5:
        return jsonify({"error": "Invalid input"}), 400

    career = predict_career(user_responses)
    return jsonify({"recommended_career": career})

if __name__ == '__main__':
    app.run(debug=True)
