import { Flask, request, jsonify } from 'flask';
import { CORS } from 'flask_cors';
import face_recognition
import cv2
import numpy as np
import base64
import os
from datetime import datetime
import csv

app = Flask(__name__)
# Enable CORS to allow requests from our React frontend (running on a different port)
CORS(app)

# Configuration Paths
DATASET_DIR = "dataset"
ATTENDANCE_FILE = "attendance.csv"

# In-memory arrays to hold known face encodings and names
known_face_encodings = []
known_face_names = []

def load_dataset():
    """
    Loads all images from the dataset folder, encodes the faces,
    and stores them in memory for real-time comparison.
    """
    global known_face_encodings, known_face_names
    print("Loading dataset...")
    
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        print(f"[*] Created '{DATASET_DIR}' folder. Please add student images here (e.g., 'John_Doe.jpg').")
        return

    loaded_count = 0
    for filename in os.listdir(DATASET_DIR):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            # Extract name from filename (e.g., "John_Doe.jpg" -> "John Doe")
            name = os.path.splitext(filename)[0].replace("_", " ")

            image_path = os.path.join(DATASET_DIR, filename)
            image = face_recognition.load_image_file(image_path)

            # Detect faces in the image and encode the first one
            encodings = face_recognition.face_encodings(image)
            if len(encodings) > 0:
                known_face_encodings.append(encodings[0])
                known_face_names.append(name)
                loaded_count += 1
            else:
                print(f"[!] Warning: No face found in {filename}. Skipping.")
                
    print(f"[*] Successfully loaded {loaded_count} faces from dataset.")

# Load dataset once when server starts
load_dataset()

def mark_attendance(name):
    """
    Records the recognized name to a CSV file.
    Prevents duplicate entries for the same person on the same date.
    Returns True if marked as new, False if already marked today.
    """
    now = datetime.now()
    date_string = now.strftime('%Y-%m-%d')
    time_string = now.strftime('%H:%M:%S')

    file_exists = os.path.isfile(ATTENDANCE_FILE)

    try:
        with open(ATTENDANCE_FILE, 'r', newline='') as f:
            reader = csv.reader(f)
            for row in reader:
                # Check for existing record matching Name and Date
                if len(row) >= 2 and row[0] == name and row[1] == date_string:
                    return False # Already marked today
    except FileNotFoundError:
        pass # File doesn't exist yet, we will create it

    # If not already marked, append a new record
    with open(ATTENDANCE_FILE, 'a+', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Name', 'Date', 'Time']) # Write header row
        writer.writerow([name, date_string, time_string])
        return True

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    """
    API endpoint that accepts a base64 encoded image frame,
    runs face recognition against the loaded dataset, and logs attendance.
    """
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    try:
        # Decode base64 image coming from React WebCam
        img_data = data['image'].split(',')[1] # Remove the "data:image/jpeg;base64," prefix
        nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert OpenCV BGR format to RGB format for face_recognition
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 1. Find all faces in the provided frame
        face_locations = face_recognition.face_locations(rgb_img)
        # 2. Extract facial encodings for each face
        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)

        names_in_frame = []
        
        for face_encoding in face_encodings:
            # See if the face is a match for the known faces
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
            name = "Unknown"

            # Use the known face with the smallest distance (most similar)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]

            names_in_frame.append(name)

            # If we recognized someone, mark them Present
            if name != "Unknown":
                marked_new = mark_attendance(name)
                return jsonify({
                    'name': name,
                    'status': 'success',
                    'message': 'Attendance marked successfully!' if marked_new else f'Welcome back, {name}. Already marked today.'
                })

        if len(names_in_frame) == 0:
            return jsonify({'name': None, 'status': 'no_face', 'message': 'No face detected in frame'})

        # Face was detected, but did not match dataset
        return jsonify({'name': 'Unknown', 'status': 'unknown', 'message': 'Face recognized, but not registered in system.'})

    except Exception as e:
        print(f"Error processing image frame: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("[*] Starting University Face Attendance Server...")
    app.run(port=5000, debug=True)
