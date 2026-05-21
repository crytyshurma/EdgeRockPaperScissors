from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)  # ✅ Allow connections from your Spring Boot site

# ✅ Load your trained model
MODEL_PATH = r"D:\EdgeAISpringBoot\edgeai\Modeltrained.keras"
model = load_model(MODEL_PATH)

# ✅ Use same class order as in your original script
classes = ['paper', 'rock', 'scissors']

@app.route('/predict', methods=['POST'])

def predict():
    try:
        file = request.files['image']

        # ✅ Convert to RGB and resize properly
        img = Image.open(file.stream).convert("RGB").resize((224, 224))

        # ✅ Normalize and expand dims
        arr = np.expand_dims(np.array(img) / 255.0, 0)

        # ✅ Make prediction
        pred = model.predict(arr)
        label = classes[np.argmax(pred)]

        return jsonify({"prediction": label})

    except Exception as e:
        import traceback
        traceback.print_exc()  # shows full error in terminal
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(port=5000)
