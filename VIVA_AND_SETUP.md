# University Portal Face Attendance - Setup & Viva Guide

Welcome to the Face Attendance Student Project. This document will guide you through setting it up locally to present for your college assignment/viva, and will provide key talking points for your professor.

---

## 🛠️ Step 1: Local Backend Setup (Python)

The core computer vision logic lives in the `/backend` folder.

1. **Install Python**: Make sure you have python 3 installed. You may also need `cmake` installed on your machine (needed for the `face_recognition` library).
2. **Open a terminal** and navigate to the backend folder:
   ```bash
   cd backend
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Prepare Dataset**: 
   - A `dataset` folder will be created when you run the script.
   - Put pictures of students in the `backend/dataset/` folder.
   - Name the files as exactly their name. Eg: `John_Smith.jpg` or `Jane_Doe.jpg`.
5. **Start the Flask AI Server**:
   ```bash
   python app.py
   ```
   *The backend will now be running on `http://localhost:5000`.*

---

## 💻 Step 2: Local Frontend Setup (React Node)

1. **Open a NEW terminal** tab.
2. Ensure you are at the project root `cd /path/to/project`.
3. **Install Node Dependencies**:
   ```bash
   npm install
   ```
4. **Start the React Frontend**:
   ```bash
   npm run dev
   ```
5. **Open Browser**: Go to `http://localhost:3000` or whatever port Vite provides. Navigate to the "Face Attendance" tab!

---

## 🎓 Viva Guide (2-3 Minutes Explanation)

### **Opening Pitch:**
"Good morning Professor. My project is an **AI-powered Smart Attendance System** integrated directly into a University Web Portal. I built this to solve the problem of manual attendance taking, making it faster, touchless, and immune to proxy-attendance."

### **How it Works (The Architecture):**
- **Frontend**: I used **React with TypeScript**, styled with Tailwind CSS. It uses the browser's native `navigator.mediaDevices.getUserMedia` API to securely access the webcam directly on the web page.
- **Data Flow**: When attendance starts, the React frontend captures video frames, converts them to Base64 strings, and sends them to the Backend API every 1.5 seconds via HTTP POST requests.
- **Backend (AI Core)**: The backend is built on **Python Flask**. I utilized **OpenCV** to decode the image and the **dlib-based `face_recognition` library** to map facial landmarks. 
  1. It finds where the face is in the image (Face Detection).
  2. It generates a 128-dimension encoding for that face.
  3. It compares this encoding to our registered dataset using Euclidean distance calculation.
- **Logging**: If a match is found (with a tolerance below 0.5), it marks their attendance in a standard CSV file, recording the Name, Date, and Time. It also contains logic to prevent duplicate entries on the same day.

### **Key Questions & Answers you might get:**

**Q: What library did you use for the AI? Did you train a custom model?**
**A**: I used the `face_recognition` library built on top of `dlib`'s state-of-the-art face recognition model, which is a ResNet network pre-trained on millions of faces. I didn't train it from scratch, but rather I use its **Few-Shot Learning** capability by giving it 1 image per student in our dataset folder, generating the 128D encoding, and comparing live captures against it.

**Q: How do you handle security and proxy attendance (showing a photo)?**
**A**: Currently, the system uses 2D facial landmarking. For a production deployment, the next step would be implementing a "Liveness Detection" layer—perhaps using blinking detection or depth-sensors—to prevent spoofing with printed photos.

**Q: Why a separated React and Flask architecture?**
**A**: Decoupling the frontend (React) and backend (Flask) follows modern microservices architecture. It allows the Python AI service to run on heavy GPU cloud servers if necessary, while the React portal can be served quickly over CDNs to student devices. They communicate purely via a stateless REST API (`/api/recognize`).
