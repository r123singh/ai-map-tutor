// AI Map Tutor - Interactive Learning Application
class MapTutor {
  constructor() {
    this.map = null;
    this.currentLayers = [];
    this.quizMode = false;
    this.currentQuiz = null;
    
    this.init();
  }

  init() {
    this.initializeMap();
    this.setupEventListeners();
    this.setupUI();
  }

  initializeMap() {
    // Initialize Leaflet map
    this.map = L.map('map').setView([20, 0], 2);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    console.log('🗺️ Map initialized successfully');
  }

  setupEventListeners() {
    // Chat input
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const query = e.target.getAttribute('data-query');
        chatInput.value = query;
        this.sendMessage();
      });
    });

    // Control buttons
    document.getElementById('clearBtn').addEventListener('click', () => this.clearChat());
    document.getElementById('quizBtn').addEventListener('click', () => this.openQuizModal());
    document.getElementById('resetMapBtn').addEventListener('click', () => this.resetMapView());
    
    // Quiz modal
    document.getElementById('closeQuizBtn').addEventListener('click', () => this.closeQuizModal());
    document.getElementById('startQuizBtn').addEventListener('click', () => this.startQuiz());
    
    // Modal click outside to close
    document.getElementById('quizModal').addEventListener('click', (e) => {
      if (e.target.id === 'quizModal') {
        this.closeQuizModal();
      }
    });
  }

  setupUI() {
    // Auto-focus chat input
    document.getElementById('chatInput').focus();
  }

  async sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const query = chatInput.value.trim();
    
    if (!query) return;

    // Add user message to chat
    this.addMessage(query, 'user');
    chatInput.value = '';

    // Show loading
    this.showLoading();

    try {
      // Send query to backend
      const response = await fetch('/api/map-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      // Hide loading
      this.hideLoading();

      if (data.success) {
        // Display AI response
        this.addMessage(data.data.description, 'ai');
        
        // Add facts if available
        if (data.data.facts) {
          const factsHtml = data.data.facts.map(fact => `<li>${fact}</li>`).join('');
          this.addMessage(`<strong>Interesting Facts:</strong><ul>${factsHtml}</ul>`, 'ai');
        }

        // Update map with the location
        this.updateMap(data.data);
      } else {
        // Show error or suggestion message
        this.addMessage(data.message, 'ai');
        
        if (data.suggestions) {
          const suggestionsHtml = data.suggestions.map(suggestion => 
            `<button class="suggestion-btn" data-query="${suggestion}">${suggestion}</button>`
          ).join('');
          this.addMessage(`<strong>Try these instead:</strong><br>${suggestionsHtml}`, 'ai');
        }
      }
    } catch (error) {
      this.hideLoading();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
      console.error('Error:', error);
    }
  }

  addMessage(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const icon = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
    messageDiv.innerHTML = `
      <div class="message-content">
        <i class="${icon}"></i>
        <div>${content}</div>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Re-attach event listeners for suggestion buttons in AI messages
    if (type === 'ai') {
      messageDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const query = e.target.getAttribute('data-query');
          document.getElementById('chatInput').value = query;
          this.sendMessage();
        });
      });
    }
  }

  updateMap(data) {
    // Clear existing layers
    this.clearMapLayers();

    // Set map view
    this.map.setView(data.coordinates, data.zoom);

    // Add GeoJSON layer based on type
    let layerStyle = {};
    let className = '';

    switch (data.type) {
      case 'country':
        layerStyle = {
          color: '#3498db',
          weight: 2,
          fillColor: '#3498db',
          fillOpacity: 0.4
        };
        className = 'map-country';
        break;
      case 'landmark':
        layerStyle = {
          color: '#f39c12',
          weight: 2,
          fillColor: '#f39c12',
          fillOpacity: 0.3
        };
        className = 'map-landmark';
        break;
      case 'river':
        layerStyle = {
          color: '#3498db',
          weight: 4,
          fillOpacity: 0
        };
        className = 'map-river';
        break;
      default:
        layerStyle = {
          color: '#e74c3c',
          weight: 3,
          fillColor: '#e74c3c',
          fillOpacity: 0.3
        };
        className = 'map-highlight';
    }

    // Add the GeoJSON layer
    const layer = L.geoJSON(data.geojson, {
      style: layerStyle,
      className: className
    }).bindPopup(`
      <div style="text-align: center;">
        <h4>${data.name}</h4>
        <p>${data.description}</p>
      </div>
    `).addTo(this.map);

    this.currentLayers.push(layer);

    // Add marker for point features
    if (data.type === 'landmark' && data.coordinates) {
      const marker = L.marker(data.coordinates)
        .bindPopup(`
          <div style="text-align: center;">
            <h4>${data.name}</h4>
            <p>${data.description}</p>
          </div>
        `)
        .addTo(this.map);
      this.currentLayers.push(marker);
    }
  }

  clearMapLayers() {
    this.currentLayers.forEach(layer => {
      this.map.removeLayer(layer);
    });
    this.currentLayers = [];
  }

  resetMapView() {
    this.clearMapLayers();
    this.map.setView([20, 0], 2);
  }

  clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
      <div class="message ai-message">
        <div class="message-content">
          <i class="fas fa-robot"></i>
          <p>Chat cleared! Ask me about any country, landmark, or geographical feature.</p>
        </div>
      </div>
    `;
  }

  showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
  }

  hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  // Quiz functionality
  openQuizModal() {
    document.getElementById('quizModal').style.display = 'block';
    this.loadQuiz();
  }

  closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
    // Do not reset quizMode or currentQuiz here, as this may interfere with quiz flow.
    // These should be reset only when the quiz is actually finished or cancelled.
  }

  async loadQuiz() {
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const quiz = await response.json();
      
      this.currentQuiz = quiz;
      document.getElementById('quizQuestion').textContent = quiz.question;
      document.getElementById('quizHint').textContent = `Hint: ${quiz.hint}`;
      
      // Update start button
      const startBtn = document.getElementById('startQuizBtn');
      startBtn.textContent = 'Start Quiz';
      startBtn.onclick = () => this.startQuiz();
    } catch (error) {
      console.error('Error loading quiz:', error);
      this.addMessage('Sorry, I couldn\'t load a quiz right now. Please try again later.', 'ai');
    }
  }

  startQuiz() {
    if (!this.currentQuiz) return;

    this.quizMode = true;
    this.closeQuizModal();
    
    // Clear map and show quiz question
    this.resetMapView();
    this.addMessage(`🎯 Quiz Time! ${this.currentQuiz.question}`, 'ai');
    this.addMessage(`💡 Hint: ${this.currentQuiz.hint}`, 'ai');
    this.addMessage('Click on the map where you think the answer is located!', 'ai');

    // Set up map click handler for quiz
    this.map.on('click', (e) => this.handleQuizClick(e));
  }

  handleQuizClick(e) {
    if (!this.quizMode || !this.currentQuiz) return;

    const clickedLat = e.latlng.lat;
    const clickedLng = e.latlng.lng;
    
    // Simple distance check (in a real app, you'd use proper GeoJSON intersection)
    const targetLat = this.currentQuiz.coordinates[0];
    const targetLng = this.currentQuiz.coordinates[1];
    
    const distance = Math.sqrt(
      Math.pow(clickedLat - targetLat, 2) + Math.pow(clickedLng - targetLng, 2)
    );

    // Check if click is within reasonable distance (rough approximation)
    if (distance < 10) { // Adjust threshold as needed
      this.addMessage('🎉 Correct! Well done!', 'ai');
      this.addMessage(`You found ${this.currentQuiz.correctAnswer}!`, 'ai');
    } else {
      this.addMessage('❌ Not quite right. Try again!', 'ai');
      this.addMessage(`💡 Remember: ${this.currentQuiz.hint}`, 'ai');
    }

    // Remove click handler
    this.map.off('click');
    this.quizMode = false;
    this.currentQuiz = null;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing AI Map Tutor...');
  window.mapTutor = new MapTutor();
  console.log('✅ AI Map Tutor ready!');
});

// Add some utility functions
window.MapUtils = {
  // Format coordinates for display
  formatCoordinates: (lat, lng) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
  },

  // Get distance between two points (rough approximation)
  getDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
};
