# 🗺️ AI Map Tutor

An interactive AI-powered geography learning application that combines conversational AI with interactive maps to help users learn about countries, landmarks, and geographical features.

## ✨ Features

### 🎯 Core Learning Features
- **AI-Powered Chat**: Ask questions about any country, landmark, or geographical feature
- **Interactive Maps**: Visual representation of locations with Leaflet.js
- **Educational Content**: Detailed descriptions and interesting facts
- **Quiz Mode**: Test your geography knowledge with interactive quizzes

### 🗺️ Map Features
- **Country Highlighting**: Visual representation of countries with borders
- **Landmark Marking**: Point out famous landmarks and natural features
- **River Tracing**: Show major rivers and water bodies
- **Custom Styling**: Different colors and styles for different feature types

### 💬 Chat Features
- **Natural Language Processing**: Ask questions in plain English
- **Suggestion Buttons**: Quick access to common queries
- **Educational Responses**: Detailed explanations with facts
- **Interactive Learning**: Click-to-learn interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd map-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Use

### Basic Usage
1. **Ask Questions**: Type questions like:
   - "Show me Australia"
   - "Mark the Great Barrier Reef"
   - "Highlight the Himalayas"
   - "Display France on the map"

2. **Interactive Learning**: 
   - Click on highlighted areas for more information
   - Use suggestion buttons for quick queries
   - Explore different geographical features

3. **Quiz Mode**:
   - Click the "Quiz Mode" button
   - Answer geography questions by clicking on the map
   - Test your knowledge with hints and feedback

### Example Queries
- **Countries**: "Show me Brazil", "Display India", "Highlight France"
- **Landmarks**: "Mark the Great Barrier Reef", "Show the Himalayas"
- **Rivers**: "Trace the Nile River", "Show the Amazon"
- **Natural Features**: "Highlight the Sahara Desert", "Show the Rocky Mountains"

## 🛠️ Technical Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality
- **Leaflet.js**: Interactive mapping library
- **Font Awesome**: Icons and visual elements

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request parsing

### Data Sources
- **OpenStreetMap**: Base map tiles
- **Natural Earth**: GeoJSON data for countries and features
- **Custom GeoJSON**: Simplified data for educational purposes

## 📁 Project Structure

```
map-chat/
├── public/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Frontend JavaScript
│   └── styles.css          # CSS styling
├── services/
│   └── server.js           # Backend server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Customization

### Adding New Locations
To add new countries or landmarks:

1. **Update the backend** (`services/server.js`):
   ```javascript
   // Add new location to the responses object
   'new-location': {
     type: 'country', // or 'landmark', 'river'
     name: 'New Location',
     coordinates: [lat, lng],
     zoom: 6,
     geojson: getNewLocationGeoJSON(),
     description: 'Description of the location',
     facts: ['Fact 1', 'Fact 2', 'Fact 3']
   }
   ```

2. **Create GeoJSON function**:
   ```javascript
   function getNewLocationGeoJSON() {
     return {
       "type": "Feature",
       "properties": { "name": "New Location" },
       "geometry": {
         "type": "Polygon", // or "LineString", "Point"
         "coordinates": [[...]]
       }
     };
   }
   ```

### Styling Customization
- **Colors**: Update CSS variables in `styles.css`
- **Map Styles**: Modify layer styles in `script.js`
- **UI Themes**: Change gradients and colors in CSS

## 🔧 API Endpoints

### POST `/api/map-query`
Query the AI for geographical information.

**Request:**
```json
{
  "query": "Show me Australia"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "country",
    "name": "Australia",
    "coordinates": [-25.27, 133.77],
    "zoom": 4,
    "geojson": {...},
    "description": "Australia 🇦🇺 - The world's smallest continent...",
    "facts": ["Fact 1", "Fact 2", "Fact 3"]
  }
}
```

### POST `/api/quiz`
Get a random geography quiz question.

**Response:**
```json
{
  "id": 1,
  "question": "Can you mark Brazil on the map?",
  "correctAnswer": "Brazil",
  "coordinates": [-14.2350, -51.9253],
  "hint": "It's the largest country in South America"
}
```

## 🌟 Educational Features

### Learning Modes
1. **Exploration Mode**: Free-form learning by asking questions
2. **Quiz Mode**: Structured testing with feedback
3. **Visual Learning**: Interactive maps with highlights and markers

### Educational Content
- **Geographical Facts**: Interesting information about locations
- **Visual Learning**: Maps with different feature types
- **Interactive Elements**: Clickable areas and popups
- **Progressive Learning**: From basic to advanced concepts

## 🚀 Future Enhancements

### Planned Features
- **Gemini AI Integration**: Real AI-powered responses
- **More GeoJSON Data**: Comprehensive geographical database
- **User Progress Tracking**: Learning analytics and achievements
- **Multi-language Support**: Internationalization
- **Advanced Quizzes**: Multiple choice and timed quizzes
- **Historical Maps**: Different time periods and empires
- **Thematic Layers**: Climate, population, economic data

### Technical Improvements
- **Database Integration**: Persistent data storage
- **User Authentication**: Personal learning profiles
- **Mobile Optimization**: Better mobile experience
- **Performance Optimization**: Faster loading and rendering

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug? Let us know!
2. **Feature Requests**: Have an idea? We'd love to hear it!
3. **Code Contributions**: Submit pull requests for improvements
4. **Documentation**: Help improve our documentation

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- **Leaflet.js**: For the amazing mapping library
- **OpenStreetMap**: For the free map tiles
- **Natural Earth**: For geographical data
- **Font Awesome**: For the beautiful icons

## 📞 Support

If you have any questions or need help:

1. Check the documentation above
2. Look at the code comments
3. Open an issue on GitHub
4. Contact the development team

---

**Happy Learning! 🌍📚**

*Explore the world through interactive AI-powered geography learning.*
