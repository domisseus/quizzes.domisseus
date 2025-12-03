const regions = {
  
  // 193 UN + 4
  // Greenland, Puerto Rico, Hong Kong & Macau , French Guiana, NC, Réunion, Curacao
  "Misc":["World", "Small_Nations", "Territories"], // 100 x

  "Americas":["Antigua_and_Barbuda", "Argentina", "Bahamas", "Barbados", "Belize", // 1 x 1 1 x
    "Bolivia", "Brazil", "Canada", "Chile", "Colombia", "Costa_Rica", "Cuba",
    "Dominica", "Dominican_Republic", "Ecuador", "El_Salvador", "Grenada", // 1 -1
    "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua",
    "Panama", "Paraguay", "Peru", "Saint_Kitts_and_Nevis", "Saint_Lucia", // -1 -1
    "Saint_Vincent_and_the_Grenadines", "Suriname", "Trinidad_and_Tobago", // 1
    "Uruguay", "USA", "Venezuela"],

  "Europe":["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia_and_Herzegovina", // 9 10 14 12 23 6
    "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", // fi: 34
    "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia",    // kosovo: 4
    "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", // 9 malta:2 monaco:1 
    "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", 
    "San_Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "UK", // 4
    "Ukraine", "Vatican_City"], // 33 1
    
  "Asia":["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", // x x x 2 x 13 
    "Brunei", "Cambodia", "China", "Georgia", "India", "Indonesia", "Iran", "Iraq", // 1
    "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos",
    "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North_Korea", // x x 2
    "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi_Arabia", "Singapore", // -1 pal: 10
    "South_Korea", "Sri_Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor_Leste", // -1 taiwan: 12
    "Turkey", "Turkmenistan", "UAE", "Uzbekistan", "Vietnam", "Yemen"],

  "Africa":["Algeria", "Angola", "Benin", "Botswana", "Burkina_Faso", "Burundi",
    "Cabo_Verde", "Cameroon", "Central_African_Republic", "Chad", "Comoros", // 6 -3
    "Congo", "Djibouti", "DR_Congo", "Egypt", "Equatorial_Guinea", "Eritrea", // x 1 x x 2
    "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea_Bissau", // 6 x x 2 x x 1
    "Ivory_Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", // x x 7
    "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", // x x x 1
    "Niger", "Nigeria", "Rwanda", "Sao_Tome_and_Principe", "Senegal", "Seychelles", // x x x 2 x 1
    "Sierra_Leone", "Somalia", "South_Africa", "South_Sudan", "Sudan", "Tanzania",
    "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"],

  "Oceania": ["Australia", "Fiji", "Kiribati", "Marshall_Islands", "Micronesia", // 65 1 1 1 1
    "Nauru", "New_Zealand", "Palau", "Papua_New_Guinea", "Samoa", // 1 38 1 3 1
    "Solomon_Islands", "Tonga", "Tuvalu", "Vanuatu"] // 1 1 1 1
}
//  {"name": "Bluff", "lat": , "lng": },

// Territories list (global)
const territoriesList = ["Greenland", "Puerto_Rico", "French_Guiana", "New_Caledonia", "Reunion", "Curaçao"]; // 21 15 5 6 14 10 

// Get container (Must exist in index.html)
const regionsContainer = document.getElementById("regionsContainer");

// MAIN DISPLAY FUNCTION
function displayRegions(searchText = "") {
    // Clear the container before rendering new results
    regionsContainer.innerHTML = "";
    
    // Clean up search text (remove extra spaces and convert to lowercase for searching)
    const cleanSearch = searchText.toLowerCase().trim();

    // Loop through each continent in the global 'regions' object
    for (const [continentName, countries] of Object.entries(regions)) {

        const isMiscSection = continentName === "Misc";

        // 1. Initial filter of standard regions (World, Small_Nations, Continent Names)
        let filteredCountries = countries.filter(region =>
            region.toLowerCase().includes(cleanSearch)
        );

        // 2. Special Logic for "Misc": Check inside the Territories list
        if (isMiscSection && cleanSearch) {
            const territoryMatch = territoriesList.some(t => 
                t.toLowerCase().replace(/_/g, " ").includes(cleanSearch)
            );

            if (territoryMatch && !filteredCountries.includes("Territories")) {
                filteredCountries.push("Territories");
            }
        }
        
        // 3. Skip empty sections
        if (filteredCountries.length === 0) continue;


        // ---- RENDER SECTION HEADER ----
        const title = document.createElement("h2");
        title.classList.add("continent-title"); 
        title.textContent = isMiscSection ? "" : continentName;
        regionsContainer.appendChild(title);

        // ---- RENDER UL LIST ----
        // ---- RENDER UL LIST (and Nav Group) ----
        const ul = document.createElement("ul");
        ul.classList.add("continent-list");

        if (isMiscSection) {
            
            // ✅ FIX: Only add the grid layout class if NOT searching.
            // When searching, this stays false, so it falls back to Flexbox (Centered).
            if (!cleanSearch) {
                ul.classList.add("misc-row");
            }
            
            // Only render the Nav Group (Info/Feedback/Achievements) if the search is EMPTY.
            // Only render the Nav Group (Info/Feedback/Achievements) if the search is EMPTY.
            if (!cleanSearch) {
                const navGroupLi = document.createElement("li");
                navGroupLi.classList.add("nav-group-wrapper");
                
                // 1. Main Vertical Stack
                const buttonStack = document.createElement("div");
                buttonStack.classList.add("nav-button-stack");

                // 2. Top Row (Holds Info & Feedback side-by-side)
                const topRow = document.createElement("div");
                topRow.classList.add("nav-button-row"); // CSS class for horizontal layout

                // --- INFO Button ---
                const infoBtn = document.createElement("div"); 
                infoBtn.textContent = "Info";
                infoBtn.classList.add("difficulty", "nav-btn");
                infoBtn.addEventListener("click", () => window.location.href = "../info/");
                topRow.appendChild(infoBtn);

                // --- FEEDBACK Button ---
                const formBtn = document.createElement("div"); 
                formBtn.textContent = "Feedback";
                formBtn.classList.add("difficulty", "nav-btn");
                formBtn.addEventListener("click", () => window.location.href = "../form/");
                topRow.appendChild(formBtn);

                // Add the row to the main stack
                buttonStack.appendChild(topRow);

                // 3. ACHIEVEMENTS Button (Sits below the row)
                const achBtn = document.createElement("div");
                achBtn.textContent = "Achievements";
                achBtn.classList.add("difficulty", "nav-btn", "achievements-btn");
                achBtn.addEventListener("click", () => {
                    window.location.href = "../achievements/"; 
                });
                buttonStack.appendChild(achBtn);
                
                navGroupLi.appendChild(buttonStack);
                ul.appendChild(navGroupLi);
            }
        }
        regionsContainer.appendChild(ul);

        // ---- ADD EACH REGION CARD ----
        filteredCountries.forEach(region => {
            const regionLi = document.createElement("li");
            regionLi.classList.add("regionName");

            if (region === "Small_Nations") {
                // --- Small Nations Logic ---
                const BtnLi = document.createElement("li");
                BtnLi.textContent = region.replace(/_/g, " ");
                BtnLi.classList.add("difficulty", "misc");        
                BtnLi.style.textAlign = "center"; 
                BtnLi.addEventListener("click", () => {
                    window.location.href = `quiz.html?region=${region.toLowerCase()}&difficulty=custom`;
                });
                regionLi.appendChild(BtnLi);

            } else if (region === "Territories") {
                // --- Territories Logic ---
                
                // 1. Header
                const headerBtn = document.createElement("div");
                headerBtn.textContent = region.replace(/_/g, " "); 
                headerBtn.classList.add("difficulty", "territory-header");
                headerBtn.style.width = "100%";
                headerBtn.style.textAlign = "center";
                headerBtn.style.cursor = "default";
                regionLi.appendChild(headerBtn);

                // 2. Grid Container
                const territoriesGridContainer = document.createElement("div");
                territoriesGridContainer.classList.add("territories-grid");
                regionLi.appendChild(territoriesGridContainer);

                // 3. Filter Buttons (Title Matching Enabled)
                const visibleTerritories = territoriesList.filter(territory => {
                    const terrName = territory.toLowerCase().replace(/_/g, " ");
                    
                    // Show button if Search is empty OR matches Name OR matches "Territories" title
                    return !cleanSearch || 
                           terrName.includes(cleanSearch) || 
                           region.toLowerCase().includes(cleanSearch); 
                });

                // 4. Render Buttons
                visibleTerritories.forEach(territory => {
                    const territoryBtn = document.createElement("div");
                    territoryBtn.textContent = territory.replace(/_/g, " ");
                    territoryBtn.classList.add("difficulty", "territories"); 
                    
                    territoryBtn.addEventListener("click", () => {
                        window.location.href = `quiz.html?region=${territory.toLowerCase()}&difficulty=custom`;
                    });
                    
                    territoriesGridContainer.appendChild(territoryBtn); 
                });

            } else {
                // --- Standard Regions Logic ---
                const nameDiv = document.createElement("div");
                nameDiv.classList.add("name-wrapper");
                nameDiv.textContent = region.replace(/_/g, " ");

                // Font sizing logic
                if (nameDiv.textContent.length > 25) nameDiv.style.fontSize = "14px";
                else if (nameDiv.textContent.length > 18) nameDiv.style.fontSize = "16px";
                else if (nameDiv.textContent.length > 11) nameDiv.style.fontSize = "18px";

                regionLi.appendChild(nameDiv);

                // 1. Get Saved Scores
                const completed = JSON.parse(localStorage.getItem('geoScores')) || [];
                
                // NEW: Check if user wants to see stars (Default is true)
                const showStarsPref = localStorage.getItem('showStars');
                const showStars = showStarsPref !== 'false';

                const difficulties = ["easy", "hard", "custom"];
                
                difficulties.forEach(diff => {
                    const btnLi = document.createElement("li");
                    
                    // Base Text
                    btnLi.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
                    btnLi.classList.add("difficulty", diff);

                    // CHECK MASTERY (Only if NOT custom AND ShowStars is true)
                    if (diff !== 'custom' && 
                        completed.includes(`${region.toLowerCase()}-${diff}`) && 
                        showStars) {
                        
                        btnLi.classList.add("mastered-btn"); 
                        
                        // Create and position the star icon
                        const starSpan = document.createElement("span");
                        starSpan.textContent = "★";
                        starSpan.classList.add("mastery-star"); 
                        btnLi.appendChild(starSpan);
                    }

                    btnLi.addEventListener("click", () => {
                        window.location.href = `quiz.html?region=${region.toLowerCase()}&difficulty=${diff}`;
                    });
                    regionLi.appendChild(btnLi);
                });
            }

            ul.appendChild(regionLi);
        });
    }
}
// Initial Load
displayRegions();

// Search Listener
document.getElementById("search").addEventListener("input", e => {
  displayRegions(e.target.value);
});

// ----------------- THEME SWITCHER LOGIC ----------------- //

const lightBtn = document.getElementById('lightBtn');
const darkBtn = document.getElementById('darkBtn');
const body = document.body;

// 1. Check Local Storage on Load
// If user previously chose 'dark', apply it immediately
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  enableDarkMode();
}

// 2. Event Listeners
lightBtn.addEventListener('click', () => {
  disableDarkMode();
});

darkBtn.addEventListener('click', () => {
  enableDarkMode();
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    // Case A: User explicitly chose Dark before
    enableDarkMode();
  } else if (savedTheme === 'light') {
    // Case B: User explicitly chose Light before
    disableDarkMode();
  } else {
    // Case C: No saved preference -> Use Device System Setting
    // Check if device prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      enableDarkMode();
    } else {
      // Default to Light if system is light or undefined
      disableDarkMode();
    }
  }
}

// 2. Run on Load
initTheme();

function enableDarkMode() {
  body.classList.add('dark-mode');
  localStorage.setItem('theme', 'dark');
  
  if(darkBtn) darkBtn.classList.add('active');
  if(lightBtn) lightBtn.classList.remove('active');
}

function disableDarkMode() {
  body.classList.remove('dark-mode');
  localStorage.setItem('theme', 'light');
  
  if(lightBtn) lightBtn.classList.add('active');
  if(darkBtn) darkBtn.classList.remove('active');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) { // Only if user hasn't manually set a preference
    if (e.matches) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    // Remove the localStorage item so it keeps following system pref until clicked
    localStorage.removeItem('theme'); 
  }
});

document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// 2. Disable Keyboard Zoom (Ctrl + "+", Ctrl + "-")
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (
      e.key === '+' || 
      e.key === '-' || 
      e.key === '=' || 
      e.key === '0'
  )) {
    e.preventDefault();
  }
});

// 3. Disable Mobile Pinch (Touch)
document.addEventListener('touchmove', function(e) {
  // If two or more fingers are touching, it's a pinch -> block it
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// 4. Disable iOS Safari Gestures (Specific)
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
document.addEventListener('gesturechange', function(e) {
  e.preventDefault();
});