import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '../public')));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// AI-powered map query endpoint
app.post('/api/map-query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Process the query with AI
    const aiResponse = await processMapQuery(query);
    
    res.json(aiResponse);
  } catch (error) {
    console.error('Error processing map query:', error);
    res.status(500).json({ error: 'Failed to process map query' });
  }
});

// Process map queries with AI logic
async function processMapQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  // Simple keyword matching for demo (in production, use Gemini API)
  const responses = {
    // Countries
    'australia': {
      type: 'country',
      name: 'Australia',
      coordinates: [-25.27, 133.77],
      zoom: 4,
      geojson: getAustraliaGeoJSON(),
      description: 'Australia 🇦🇺 - The world\'s smallest continent and largest island, home to unique wildlife and diverse landscapes.',
      facts: ['6th largest country by area', 'Only country that is also a continent', 'Home to the Great Barrier Reef']
    },
    'france': {
      type: 'country',
      name: 'France',
      coordinates: [46.2276, 2.2137],
      zoom: 6,
      geojson: getFranceGeoJSON(),
      description: 'France 🇫🇷 - A country in Western Europe known for its culture, cuisine, and landmarks like the Eiffel Tower.',
      facts: ['Most visited country in the world', 'Home to the Louvre Museum', 'Famous for wine production']
    },
    'brazil': {
      type: 'country',
      name: 'Brazil',
      coordinates: [-14.2350, -51.9253],
      zoom: 4,
      geojson: getBrazilGeoJSON(),
      description: 'Brazil 🇧🇷 - The largest country in South America, famous for the Amazon rainforest and Carnival.',
      facts: ['Largest country in South America', 'Home to the Amazon rainforest', 'Official language is Portuguese']
    },
    'india': {
      type: 'country',
      name: 'India',
      coordinates: [20.5937, 78.9629],
      zoom: 5,
      geojson: getIndiaGeoJSON(),
      description: 'India 🇮🇳 - A diverse country in South Asia with rich culture, history, and the world\'s second-largest population.',
      facts: ['Second most populous country', 'Home to the Taj Mahal', 'Birthplace of four major religions']
    },
    
    // Landmarks
    'great barrier reef': {
      type: 'landmark',
      name: 'Great Barrier Reef',
      coordinates: [-18.2871, 147.6992],
      zoom: 6,
      geojson: getGreatBarrierReefGeoJSON(),
      description: 'Great Barrier Reef 🌊 - The world\'s largest coral reef system, stretching over 2,300 km along Australia\'s northeast coast.',
      facts: ['Largest coral reef system', 'Visible from space', 'Home to thousands of marine species']
    },
    'himalayas': {
      type: 'landmark',
      name: 'Himalayas',
      coordinates: [28.0, 84.0],
      zoom: 5,
      geojson: getHimalayasGeoJSON(),
      description: 'Himalayas 🏔️ - The highest mountain range in the world, home to Mount Everest and many other peaks.',
      facts: ['Contains Mount Everest', 'Stretches across 5 countries', 'Youngest mountain range']
    },
    'nile river': {
      type: 'landmark',
      name: 'Nile River',
      coordinates: [26.0, 30.0],
      zoom: 5,
      geojson: getNileRiverGeoJSON(),
      description: 'Nile River 🌊 - The longest river in the world, flowing through 11 countries in northeastern Africa.',
      facts: ['Longest river in the world', 'Flows through 11 countries', 'Ancient Egyptian civilization developed along its banks']
    }
  };

  // Find matching response
  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuery.includes(key)) {
      return {
        success: true,
        data: response,
        query: query
      };
    }
  }

  // Use AI to process the query
  const aiResponse = await processQueryWithAI(query);
  if (aiResponse.success) {
  return aiResponse;
  }
  
  // Default response for unrecognized queries
  return {
    success: false,
    message: "I'm still learning! Try asking about countries like 'Australia', 'France', 'Brazil', or landmarks like 'Great Barrier Reef', 'Himalayas', or 'Nile River'.",
    suggestions: [
      "Show me Australia",
      "Mark the Great Barrier Reef", 
      "Highlight the Himalayas",
      "Display France on the map"
    ]
  };
}

// GeoJSON data for different locations
function getAustraliaGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "Australia" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [113.338953078, -43.6345972634],
        [153.569469029, -43.6345972634],
        [153.569469029, -10.6681857235],
        [113.338953078, -10.6681857235],
        [113.338953078, -43.6345972634]
      ]]
    }
  };
}

function getFranceGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "France" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [2.0, 51.0],
        [8.0, 51.0],
        [8.0, 42.0],
        [2.0, 42.0],
        [2.0, 51.0]
      ]]
    }
  };
}

function getBrazilGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "Brazil" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-74.0, 5.0],
        [-34.0, 5.0],
        [-34.0, -34.0],
        [-74.0, -34.0],
        [-74.0, 5.0]
      ]]
    }
  };
}

function getIndiaGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "India" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [68.0, 37.0],
        [97.0, 37.0],
        [97.0, 6.0],
        [68.0, 6.0],
        [68.0, 37.0]
      ]]
    }
  };
}

function getGreatBarrierReefGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "Great Barrier Reef" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [142.0, -10.0],
        [150.0, -10.0],
        [150.0, -25.0],
        [142.0, -25.0],
        [142.0, -10.0]
      ]]
    }
  };
}

function getHimalayasGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "Himalayas" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [70.0, 35.0],
        [95.0, 35.0],
        [95.0, 25.0],
        [70.0, 25.0],
        [70.0, 35.0]
      ]]
    }
  };
}

function getNileRiverGeoJSON() {
  return {
    "type": "Feature",
    "properties": { "name": "Nile River" },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [30.0, 31.0],
        [30.0, 25.0],
        [30.0, 20.0],
        [30.0, 15.0],
        [30.0, 10.0],
        [30.0, 5.0]
      ]
    }
  };
}

// AI processing using Gemini
async function processQueryWithAI(query) {
  const prompt = `
You are a helpful assistant that can answer questions about geography.
You are given a query and you need to answer it.
You must return the answer in the following JSON format:
{
  "success": true,
  "data": {
    "type": "country",
    "name": "Australia",
    "coordinates": [-25.27, 133.77],
    "zoom": 4,
    "geojson": {
    "type": "Feature",
    "properties": { "name": "Australia" },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [113.338953078, -43.6345972634],
        [153.569469029, -43.6345972634],
        [153.569469029, -10.6681857235],
        [113.338953078, -10.6681857235],
        [113.338953078, -43.6345972634]
      ]]
    }
  },
    "description": "Australia 🇦🇺 - The world's smallest continent...",
    "facts": ["Fact 1", "Fact 2", "Fact 3"]
  }
}
The query is: "${query}"
Return ONLY the JSON object, nothing else.
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message: "Gemini API key not set in environment variables."
    };
  }

  try {
    // Gemini API expects a specific structure for the request body
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Defensive: check for candidates and content
    const candidates = response.data?.candidates;
    if (!candidates || !candidates[0]?.content?.parts || !candidates[0].content.parts[0]?.text) {
      return {
        success: false,
        message: "No valid response from Gemini API."
      };
    }

    // The model's response should be a JSON string
    let jsonText = candidates[0].content.parts[0].text.trim();

    // Remove code block markers if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Parse the JSON safely
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      return {
        success: false,
        message: "Failed to parse Gemini response as JSON.",
        raw: jsonText
      };
    }

    // If the model already returns the expected structure, return it
    if (parsed.success && parsed.data) {
      console.log("Already in the expected structure");
      return {
        ...parsed,
        query: query
      };
    }

    // Otherwise, wrap the data
    console.log("Wrapping the data");
    return {
      success: true,
      data: parsed,
      query: query
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error?.response?.data || error.message || error);
    return {
      success: false,
      message: "Error communicating with Gemini API.",
      error: error?.response?.data || error.message || error
    };
  }
}

// Quiz endpoint
app.post('/api/quiz', async (req, res) => {
  //AI based quiz
  const quiz = await processQuizWithAI();

  if (quiz.success) {
    res.json(quiz.data);
  }
  // This code is correct for generating a random quiz and returning it as JSON.
  // It fetches a random quiz from the quizzes array and returns it.
  const quizzes = [
    {
      id: 1,
      question: "Can you mark Brazil on the map?",
      correctAnswer: "Brazil",
      coordinates: [-14.2350, -51.9253],
      hint: "It's the largest country in South America"
    },
    {
      id: 2,
      question: "Where is the Great Barrier Reef located?",
      correctAnswer: "Great Barrier Reef",
      coordinates: [-18.2871, 147.6992],
      hint: "It's off the northeast coast of Australia"
    },
    {
      id: 3,
      question: "Mark the Himalayas mountain range",
      correctAnswer: "Himalayas",
      coordinates: [28.0, 84.0],
      hint: "It's home to Mount Everest"
    }
  ];
  
  const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
  res.json(randomQuiz);
});

// AI processing using gemini
async function processQuizWithAI() {
  try {
    const prompt = `
    You are a helpful assistant that can generate a random geography quiz question.
    You need to generate a random quiz question and answer.
    The quiz should be in the following JSON format:
    {
      "id": 1,
      "question": "Can you mark Brazil on the map?",
      "correctAnswer": "Brazil",
      "coordinates": [-14.2350, -51.9253],
      "hint": "It's the largest country in South America"
    }
    Return ONLY the JSON object, nothing else.
    `;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        message: "Gemini API key not set in environment variables."
      };
    }
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    );
    // Check for errors in the response
    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0] ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      !response.data.candidates[0].content.parts[0] ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      return {
        success: false,
        message: "Invalid response from Gemini API.",
        error: response.data
      };
    }
    let quizData;
    try {
      quizData = JSON.parse(response.data.candidates[0].content.parts[0].text.trim());
    } catch (err) {
      return {
        success: false,
        message: "Failed to parse Gemini API response as JSON.",
        error: err.message
      };
    }
    return {
      success: true,
      data: quizData
    };
  } catch (error) {
    return {
      success: false,
      message: "Error communicating with Gemini API.",
      error: error?.response?.data || error.message || error
    };
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🗺️  AI Map Tutor server running on http://localhost:${PORT}`);
  console.log('📚 Ready to help with geography learning!');
});
