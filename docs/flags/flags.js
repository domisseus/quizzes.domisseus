// DOM Elements
const menuView = document.getElementById('menu-view');
const gameView = document.getElementById('game-view');
const flashcard = document.getElementById('flashcard');

const flagDisplay = document.getElementById('flag-display');
const flagName = document.getElementById('flag-name');
const instruction = document.getElementById('instruction');

// Buttons
const btnWorld = document.getElementById('btn-world');
const btnEurope = document.getElementById('btn-europe');
const btnAmericas = document.getElementById('btn-americas');
const btnAsia = document.getElementById('btn-asia');
const btnAfrica = document.getElementById('btn-africa');
const btnOceania = document.getElementById('btn-oceania');
const btnTerritories = document.getElementById('btn-territories');
const btnBack = document.getElementById('back-btn');

// --- THE REAL DATA (Using FlagCDN Country Codes) ---
const europe = [
    { name: "Albania", code: "al" }, { name: "Andorra", code: "ad" }, { name: "Austria", code: "at" }, { name: "Belarus", code: "by" }, { name: "Belgium", code: "be" },
    { name: "Bosnia and Herzegovina", code: "ba" }, { name: "Bulgaria", code: "bg" }, { name: "Croatia", code: "hr" }, { name: "Cyprus", code: "cy" }, { name: "Czechia", code: "cz" },
    { name: "Denmark", code: "dk" }, { name: "Estonia", code: "ee" }, { name: "Finland", code: "fi" }, { name: "France", code: "fr" }, { name: "Germany", code: "de" },
    { name: "Greece", code: "gr" }, { name: "Hungary", code: "hu" }, { name: "Iceland", code: "is" }, { name: "Ireland", code: "ie" }, { name: "Italy", code: "it" },
    { name: "Kosovo", code: "xk" }, { name: "Latvia", code: "lv" }, { name: "Liechtenstein", code: "li" }, { name: "Lithuania", code: "lt" }, { name: "Luxembourg", code: "lu" },
    { name: "Malta", code: "mt" }, { name: "Moldova", code: "md" }, { name: "Monaco", code: "mc" }, { name: "Montenegro", code: "me" }, { name: "Netherlands", code: "nl" },
    { name: "North Macedonia", code: "mk" }, { name: "Norway", code: "no" }, { name: "Poland", code: "pl" }, { name: "Portugal", code: "pt" }, { name: "Romania", code: "ro" },
    { name: "Russia", code: "ru" }, { name: "San Marino", code: "sm" }, { name: "Serbia", code: "rs" }, { name: "Slovakia", code: "sk" }, { name: "Slovenia", code: "si" },
    { name: "Spain", code: "es" }, { name: "Sweden", code: "se" }, { name: "Switzerland", code: "ch" }, { name: "Ukraine", code: "ua" }, { name: "United Kingdom", code: "gb" }, { name: "Vatican City", code: "va" }
];

const americas = [
    { name: "Antigua and Barbuda", code: "ag" }, { name: "Argentina", code: "ar" }, { name: "Bahamas", code: "bs" }, { name: "Barbados", code: "bb" }, { name: "Belize", code: "bz" },
    { name: "Bolivia", code: "bo" }, { name: "Brazil", code: "br" }, { name: "Canada", code: "ca" }, { name: "Chile", code: "cl" }, { name: "Colombia", code: "co" },
    { name: "Costa Rica", code: "cr" }, { name: "Cuba", code: "cu" }, { name: "Dominica", code: "dm" }, { name: "Dominican Republic", code: "do" }, { name: "Ecuador", code: "ec" },
    { name: "El Salvador", code: "sv" }, { name: "Grenada", code: "gd" }, { name: "Guatemala", code: "gt" }, { name: "Guyana", code: "gy" }, { name: "Haiti", code: "ht" },
    { name: "Honduras", code: "hn" }, { name: "Jamaica", code: "jm" }, { name: "Mexico", code: "mx" }, { name: "Nicaragua", code: "ni" }, { name: "Panama", code: "pa" },
    { name: "Paraguay", code: "py" }, { name: "Peru", code: "pe" }, { name: "Saint Kitts and Nevis", code: "kn" }, { name: "Saint Lucia", code: "lc" }, { name: "Saint Vincent", code: "vc" },
    { name: "Suriname", code: "sr" }, { name: "Trinidad and Tobago", code: "tt" }, { name: "United States", code: "us" }, { name: "Uruguay", code: "uy" }, { name: "Venezuela", code: "ve" }
];

const asia = [
    { name: "Afghanistan", code: "af" }, { name: "Armenia", code: "am" }, { name: "Azerbaijan", code: "az" }, { name: "Bahrain", code: "bh" }, { name: "Bangladesh", code: "bd" },
    { name: "Bhutan", code: "bt" }, { name: "Brunei", code: "bn" }, { name: "Cambodia", code: "kh" }, { name: "China", code: "cn" }, { name: "Georgia", code: "ge" },
    { name: "India", code: "in" }, { name: "Indonesia", code: "id" }, { name: "Iran", code: "ir" }, { name: "Iraq", code: "iq" }, { name: "Israel", code: "il" },
    { name: "Japan", code: "jp" }, { name: "Jordan", code: "jo" }, { name: "Kazakhstan", code: "kz" }, { name: "Kuwait", code: "kw" }, { name: "Kyrgyzstan", code: "kg" },
    { name: "Laos", code: "la" }, { name: "Lebanon", code: "lb" }, { name: "Malaysia", code: "my" }, { name: "Maldives", code: "mv" }, { name: "Mongolia", code: "mn" },
    { name: "Myanmar", code: "mm" }, { name: "Nepal", code: "np" }, { name: "North Korea", code: "kp" }, { name: "Oman", code: "om" }, { name: "Pakistan", code: "pk" },
    { name: "Palestine", code: "ps" }, { name: "Philippines", code: "ph" }, { name: "Qatar", code: "qa" }, { name: "Saudi Arabia", code: "sa" }, { name: "Singapore", code: "sg" },
    { name: "South Korea", code: "kr" }, { name: "Sri Lanka", code: "lk" }, { name: "Syria", code: "sy" }, { name: "Taiwan", code: "tw" }, { name: "Tajikistan", code: "tj" },
    { name: "Thailand", code: "th" }, { name: "Timor-Leste", code: "tl" }, { name: "Turkey", code: "tr" }, { name: "Turkmenistan", code: "tm" }, { name: "UAE", code: "ae" },
    { name: "Uzbekistan", code: "uz" }, { name: "Vietnam", code: "vn" }, { name: "Yemen", code: "ye" }
];

const africa = [
    { name: "Algeria", code: "dz" }, { name: "Angola", code: "ao" }, { name: "Benin", code: "bj" }, { name: "Botswana", code: "bw" }, { name: "Burkina Faso", code: "bf" },
    { name: "Burundi", code: "bi" }, { name: "Cabo Verde", code: "cv" }, { name: "Cameroon", code: "cm" }, { name: "Central African Republic", code: "cf" }, { name: "Chad", code: "td" },
    { name: "Comoros", code: "km" }, { name: "Congo", code: "cg" }, { name: "DR Congo", code: "cd" }, { name: "Djibouti", code: "dj" }, { name: "Egypt", code: "eg" },
    { name: "Equatorial Guinea", code: "gq" }, { name: "Eritrea", code: "er" }, { name: "Eswatini", code: "sz" }, { name: "Ethiopia", code: "et" }, { name: "Gabon", code: "ga" },
    { name: "Gambia", code: "gm" }, { name: "Ghana", code: "gh" }, { name: "Guinea", code: "gn" }, { name: "Guinea-Bissau", code: "gw" }, { name: "Ivory Coast", code: "ci" },
    { name: "Kenya", code: "ke" }, { name: "Lesotho", code: "ls" }, { name: "Liberia", code: "lr" }, { name: "Libya", code: "ly" }, { name: "Madagascar", code: "mg" },
    { name: "Malawi", code: "mw" }, { name: "Mali", code: "ml" }, { name: "Mauritania", code: "mr" }, { name: "Mauritius", code: "mu" }, { name: "Morocco", code: "ma" },
    { name: "Mozambique", code: "mz" }, { name: "Namibia", code: "na" }, { name: "Niger", code: "ne" }, { name: "Nigeria", code: "ng" }, { name: "Rwanda", code: "rw" },
    { name: "Sao Tome and Principe", code: "st" }, { name: "Senegal", code: "sn" }, { name: "Seychelles", code: "sc" }, { name: "Sierra Leone", code: "sl" }, { name: "Somalia", code: "so" },
    { name: "South Africa", code: "za" }, { name: "South Sudan", code: "ss" }, { name: "Sudan", code: "sd" }, { name: "Tanzania", code: "tz" }, { name: "Togo", code: "tg" },
    { name: "Tunisia", code: "tn" }, { name: "Uganda", code: "ug" }, { name: "Zambia", code: "zm" }, { name: "Zimbabwe", code: "zw" }
];

const oceania = [
    { name: "Australia", code: "au" }, { name: "Fiji", code: "fj" }, { name: "Kiribati", code: "ki" }, { name: "Marshall Islands", code: "mh" }, { name: "Micronesia", code: "fm" },
    { name: "Nauru", code: "nr" }, { name: "New Zealand", code: "nz" }, { name: "Palau", code: "pw" }, { name: "Papua New Guinea", code: "pg" }, { name: "Samoa", code: "ws" },
    { name: "Solomon Islands", code: "sb" }, { name: "Tonga", code: "to" }, { name: "Tuvalu", code: "tv" }, { name: "Vanuatu", code: "vu" }
];

const territories = [
    { name: "Greenland", code: "gl" }, { name: "Puerto Rico", code: "pr" }, { name: "Hong Kong", code: "hk" }, { name: "Macau", code: "mo" },
    { name: "French Guiana", code: "gf" }, { name: "New Caledonia", code: "nc" }, { name: "Réunion", code: "re" }, { name: "Curaçao", code: "cw" }
];

// World is simply all the standard continents combined!
const world = [...europe, ...americas, ...asia, ...africa, ...oceania];

// Game State Variables
let currentQueue = [];
let currentIndex = 0;
let isRevealed = false;

// --- Event Listeners for Menus ---
btnWorld.addEventListener('click', () => startGame(world));
btnEurope.addEventListener('click', () => startGame(europe));
btnAmericas.addEventListener('click', () => startGame(americas));
btnAsia.addEventListener('click', () => startGame(asia));
btnAfrica.addEventListener('click', () => startGame(africa));
btnOceania.addEventListener('click', () => startGame(oceania));
btnTerritories.addEventListener('click', () => startGame(territories));
btnBack.addEventListener('click', showMenu);

// --- Game Logic ---
function startGame(dataArray) {
    // 1. Shuffle the array
    currentQueue = [...dataArray].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    
    // 2. Switch Views
    menuView.style.display = 'none';
    gameView.style.display = 'block';
    
    // 3. Load the first flag
    loadFlag();
}

function showMenu() {
    gameView.style.display = 'none';
    menuView.style.display = 'block';
}

function loadFlag() {
    isRevealed = false;
    const currentItem = currentQueue[currentIndex];
    
    // Inject the Flag image from FlagCDN
    flagDisplay.innerHTML = `<img src="https://flagcdn.com/w320/${currentItem.code}.png" alt="Flag of ${currentItem.name}" style="max-width: 100%; max-height: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`;
    
    // Set the hidden name and reset instructions
    flagName.textContent = currentItem.name;
    flagName.classList.add('hidden');
    instruction.textContent = "";
}

// --- The 2-Click Interaction Mechanic (Never Ending) ---
flashcard.addEventListener('click', () => {
    if (!isRevealed) {
        // First Click: Reveal the answer
        flagName.classList.remove('hidden');
        instruction.textContent = "";
        isRevealed = true;
    } else {
        // Second Click: Move to next flag
        currentIndex++;
        
        // NEVER ENDING LOGIC: If we hit the end of the deck, shuffle and restart silently!
        if (currentIndex >= currentQueue.length) {
            currentQueue = [...currentQueue].sort(() => Math.random() - 0.5);
            currentIndex = 0;
        }
        
        loadFlag();
    }
});