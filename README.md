
# Educational Content Generator

A web application that generates customized educational materials such as lesson plans, study guides, Bloom's taxonomy activities, exam revision sheets, and differentiated instruction plans. The content is dynamically generated using Google's Gemini API (Generative Language Model).

---

## Features

- Generate content tailored to specific grade levels, subjects, and topics
- Multiple content templates to choose from:
  - Lesson plans
  - Study guides
  - Bloom's taxonomy activities
  - Exam revision sheets
  - Differentiated instruction plans
- Copy generated content to clipboard
- Download generated content as a text file
- Performance metrics display for generation speed
- Input validation and error handling

---

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- API: Google Gemini Language API
- Environment variables managed with `.env` and `dotenv`

---

## Setup & Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Google Cloud account with access to Gemini API and an API key

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/KatekiPearl/Educational-generator-LearnZone.git
   cd educational-content-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. Start the server:

   ```bash
   node server.js
   ```

5. Open `index.html` in your browser (or navigate to `http://localhost:3000` if your server serves static files).

---

## Usage

1. Fill in the form fields: Grade level, Subject, Topic, and select a content template.
2. Click **Generate** to create educational content.
3. View the generated content and performance time.
4. Use the **Copy** button to copy content to clipboard.
5. Use the **Download** button to save content as a `.txt` file.

---

## Project Structure

```
├── server
│   └── server.js        # Backend Express server
├── public
│   ├── index.html       # Frontend HTML
│   ├── styles.css       # CSS styles
│   └── script.js        # Frontend JavaScript
├── .env                 # Environment variables (API key)
├── package.json         # Node project metadata and scripts
└── README.md            # Project documentation
```

---

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key to authenticate requests.

---

## Troubleshooting

- **Error:** `Failed to parse URL from undefined?key=undefined`  
  **Solution:** Make sure the `.env` file exists with the correct `GEMINI_API_KEY` and that your server loads it properly using `dotenv`.

- Ensure you have a valid API key and network connection.

- Check console or server logs for detailed errors.

---

## License

This project is licensed under the MIT License.

---

## Contact

Created by [Katekani Dlomu] — katekanidlomu@gmail.com]

Feel free to reach out for any questions or feedback!
