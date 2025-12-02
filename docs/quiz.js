// URL params
const urlParams = new URLSearchParams(window.location.search);
const region = urlParams.get("region");
const difficulty = urlParams.get("difficulty") || "easy"; // default easy

let map;
let cities = [];
let remainingCities = [];
let currentCity = null;
let answerMarker = null;
let attempts = 0;
let correctCount = 0;
let questionCount = 0;
let quizLocked = false;
let sessionEnded = false;
let totalQuestions = null;
let totalElapsedTime = 0; // Timer that counts up from 0
let countdown = null; // general timer interval variable

// Global settings placeholder
let regionSettings = {};

const quizContainer = document.getElementById('quizContainer');
const statusEl = document.getElementById('status');
const backButton = document.getElementById('backButton');
const resetBtn = document.getElementById('resetBtn'); // always visible
const timerEl = document.getElementById('timer');

backButton.addEventListener('click', () => {
  window.location.href = "index.html";
});

// 1. NEW PART: Fetch settings first, then start the quiz
async function initGame() {
  const response = await fetch('region_settings.json');
  regionSettings = await response.json();
  startQuiz(region);
}

function startQuiz(region) {
  const citiesFile = `city_jsons/${region}.json`;
  
  // 2. Logic to read the Bbox or Center from the JSON
  let mapConfig = {
    center: [0, 20],
    zoom: 2,
    bbox: null
  };

  if (regionSettings[region]) {
    if (regionSettings[region].bbox) {
      mapConfig.bbox = regionSettings[region].bbox;
    } else if (regionSettings[region].center) {
      mapConfig.center = regionSettings[region].center;
      mapConfig.zoom = regionSettings[region].zoom;
    }
  }

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019ad292-6105-737d-942e-a6933e5c5ca9/style.json?key=Log0g5gRFj2BYhuEUZho',
    center: mapConfig.center,
    zoom: mapConfig.zoom,
    doubleClickZoom: false,
    // We start with a low minZoom (0) to allow the map to load/fit freely first
    minZoom: 0 
  });

  map.on('load', () => {
    let finalZoom = map.getZoom(); // Default to current manual zoom

    // A. Apply BBox if it exists using cameraForBounds for precision
    if (mapConfig.bbox) {
      // Calculate where the camera SHOULD be to fit this box
      const camera = map.cameraForBounds(mapConfig.bbox, {
        padding: 20
      });

      // If valid, jump there and save the zoom level
      if (camera) {
        map.jumpTo(camera);
        finalZoom = camera.zoom;
      }
    }

    // B. LOGIC: Lock Zoom Out for specific regions
    if (region !== "world" && region !== "small_nations") {
        // Set the floor limit to the calculated fitBounds zoom
        map.setMinZoom(finalZoom);
    } else {
        // For World/Small Nations, allow zooming out further
        map.setMinZoom(2);
    }
  });

  map.on('click', handleMapClick);

  fetch(citiesFile)
    .then(response => response.json())
    .then(data => {
      cities = data;

      setupMisc(); // slice based on difficulty
      totalQuestions = remainingCities.length;
      correctCount = 0;
      questionCount = 0;
      sessionEnded = false;

      startTotalTimer();
      showCityList();
      nextQuestion();
    });

  setupResetButton();
}

function startTotalTimer() {
    clearInterval(countdown); // Clear any existing timer
    totalElapsedTime = 0;
    timerEl.textContent = `Time: 0s`;

    countdown = setInterval(() => {
        totalElapsedTime++;
        // Format seconds into minutes/seconds display
        const minutes = Math.floor(totalElapsedTime / 60);
        const seconds = totalElapsedTime % 60;
        const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        
        timerEl.textContent = `Time: ${timeDisplay}`;
    }, 1000);
}

// Set remainingCities based on difficulty and region (world)
function setupMisc() {
  if (region === "world") {
    if (difficulty === "easy") remainingCities = cities.slice(0, 30);
    else if (difficulty === "hard") remainingCities = cities.slice(0, 100);
    else remainingCities = [...cities]; // custom
  } else {
    if (difficulty === "easy") remainingCities = cities.slice(0, 3);
    else if (difficulty === "hard") remainingCities = cities.slice(0, 10);
    else remainingCities = [...cities]; // custom
  }
}

// Display city list
function showCityList() {
  const cityListEl = document.getElementById('cityList');
  cityListEl.innerHTML = '';

  // Sort cities alphabetically by name
  const sortedCities = remainingCities.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  sortedCities.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city.name;
    // RESTORED: Original ID logic (only removes spaces)
    li.id = `city-${city.name.replace(/\s+/g, '')}`;
    cityListEl.appendChild(li);
  });
}

// NEXT QUESTION
function nextQuestion() {
  if (answerMarker) {
    answerMarker.remove();
    answerMarker = null;
  }

  attempts = 0;
  quizLocked = false;

  if (remainingCities.length === 0) {
    sessionEnded = true;
    document.getElementById('question').textContent = "Quiz Finished!";

    clearInterval(countdown);

    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingCities.length);
  currentCity = remainingCities.splice(randomIndex, 1)[0];
  questionCount++;

  updateScore();
  document.getElementById('question').textContent = `Find: ${currentCity.name}`;
}

// UPDATE SCORE
function updateScore() {
  document.getElementById('score').textContent = `Correct: ${correctCount}/${totalQuestions}`;
  document.getElementById('progress').textContent = `Question: ${questionCount}/${totalQuestions}`;
}

// SETUP RESET BUTTON
function setupResetButton() {
  resetBtn.addEventListener('click', () => {
    setupMisc();
    correctCount = 0;
    questionCount = 0;
    sessionEnded = false;
    statusEl.textContent = '';
    
    // RESTORED: Original reset color logic
    cities.forEach(city => {
      const cityLi = document.getElementById(`city-${city.name.replace(/\s+/g, '')}`);
      if (cityLi) cityLi.style.backgroundColor = '';
    });

    clearInterval(countdown);
    startTotalTimer();
    showCityList();
    nextQuestion();
  });
}

// HANDLE MAP CLICK
function handleMapClick(e) {
  if (quizLocked || sessionEnded) return;

  const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
  const cityLngLat = [currentCity.lng, currentCity.lat];
  const distance = getDistance(clickedLngLat, cityLngLat);
 
  const currentZoom = map.getZoom();
  let hitboxRadius = Math.max(1000, 600000 / Math.pow(currentZoom, 2.2));
  
  // RESTORED: Original ID lookup logic
  const cityLi = document.getElementById(`city-${currentCity.name.replace(/\s+/g, '')}`);

  if (distance < hitboxRadius) {
    // Correct
    if (attempts === 0) {
      correctCount++;
      // RESTORED: Original Colors
      if (cityLi) cityLi.style.backgroundColor = 'lightgreen';
      statusEl.style.color = 'green';
    } else if (attempts === 1 || attempts === 2) { // 2nd or 3rd try
      correctCount++;
      if (cityLi) cityLi.style.backgroundColor = 'orange';
      statusEl.style.color = 'orange';
    } else {
      if (cityLi) cityLi.style.backgroundColor = 'lightcoral';
      statusEl.style.color = 'red';
    }
    statusEl.textContent = `You found ${currentCity.name}.`;

    if (remainingCities.length === 0) {
        // We need to wait a tiny bit for the score to update
        setTimeout(() => {
           savePerfectScore(); // <--- ADD THIS LINE
        }, 100);
    }

    nextQuestion();
  } else {
    attempts++;
    statusEl.style.color = "#ec4b3fff";
    if (attempts >= 3) {
      revealCityPin(cityLngLat);
      if (cityLi) cityLi.style.backgroundColor = 'lightcoral';
    } else {
      statusEl.textContent = `❌ Wrong! Try again. (${attempts}/3)`;
    }
  }
  updateScore();
}

// CALCULATE DISTANCE
function getDistance([lng1, lat1], [lng2, lat2]) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// REVEAL CITY PIN
function revealCityPin(cityLngLat) {
  if (answerMarker) return;
  quizLocked = true;

  answerMarker = new maplibregl.Marker({ color: 'red' })
    .setLngLat(cityLngLat)
    .addTo(map);

  statusEl.textContent = `The city pin is revealed, click it to continue.`;

  answerMarker.getElement().addEventListener('click', ev => {
    ev.stopPropagation();
    answerMarker.remove();
    answerMarker = null;
    attempts = 0;
    quizLocked = false;
    statusEl.textContent = `You found ${currentCity.name}.`;
    nextQuestion();
  }, { once: true });
}

// 4. IMPORTANT: Call the new init function
initGame();

// NEW: Save progress to LocalStorage (Handles both Easy & Hard)
function savePerfectScore() {
  // 1. Check if the score is PERFECT (e.g. 10/10)
  if (correctCount === totalQuestions && difficulty !== 'custom') {
    
    // 2. Get existing progress
    let completed = JSON.parse(localStorage.getItem('geoScores')) || [];

    // 3. Create a unique identifier: e.g., "france-easy" or "brazil-hard"
    let achievementKey = `${region}-${difficulty}`;

    // 4. Save if not already there
    if (!completed.includes(achievementKey)) {
      completed.push(achievementKey);
      localStorage.setItem('geoScores', JSON.stringify(completed));
      
      // Optional: Visual feedback
      // alert(`🏆 Perfect Score! '${region}' (${difficulty}) completed!`);
    }
  }
}