document.addEventListener('DOMContentLoaded', () => {
    const masterList = document.getElementById('masterList');
    const toggleStars = document.getElementById('toggleStars');

    // 1. Full List of Regions
    const allRegions = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua_and_Barbuda", "Argentina", "Armenia", 
        "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
        "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia_and_Herzegovina", "Botswana", "Brazil", "Brunei", 
        "Bulgaria", "Burkina_Faso", "Burundi", "Cabo_Verde", "Cambodia", "Cameroon", "Canada", 
        "Central_African_Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa_Rica", 
        "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", 
        "Dominican_Republic", "DR_Congo", "Ecuador", "Egypt", "El_Salvador", "Equatorial_Guinea", "Eritrea", 
        "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "French_Guiana", "Gabon", "Gambia", 
        "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea_Bissau", 
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
        "Israel", "Italy", "Ivory_Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
        "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
        "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", 
        "Maldives", "Mali", "Malta", "Marshall_Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
        "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", 
        "Nepal", "Netherlands", "New_Caledonia", "New_Zealand", "Nicaragua", "Niger", "Nigeria", "North_Korea", 
        "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua_New_Guinea", "Paraguay", "Peru", 
        "Philippines", "Poland", "Portugal", "Puerto_Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", 
        "Saint_Kitts_and_Nevis", "Saint_Lucia", "Saint_Vincent_and_the_Grenadines", "Samoa", "San_Marino", 
        "Sao_Tome_and_Principe", "Saudi_Arabia", "Senegal", "Serbia", "Seychelles", "Sierra_Leone", "Singapore", 
        "Slovakia", "Slovenia", "Small_Nations", "Solomon_Islands", "Somalia", "South_Africa", "South_Korea", 
        "South_Sudan", "Spain", "Sri_Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
        "Tajikistan", "Tanzania", "Thailand", "Timor_Leste", "Togo", "Tonga", "Trinidad_and_Tobago", "Tunisia", 
        "Turkey", "Turkmenistan", "Tuvalu", "UAE", "Uganda", "UK", "Ukraine", "Uruguay", "USA", "Uzbekistan", 
        "Vanuatu", "Vatican_City", "Venezuela", "Vietnam", "World", "Yemen", "Zambia", "Zimbabwe"
    ];

    allRegions.sort();

    // 2. Load Saved Scores
    const completed = JSON.parse(localStorage.getItem('geoScores')) || [];

    // 3. Render The Combined List
    renderMasterList(allRegions, completed, masterList);

    // 4. Handle "Show Stars" Toggle
    const showStarsPref = localStorage.getItem('showStars');
    toggleStars.checked = showStarsPref !== 'false'; 

    toggleStars.addEventListener('change', (e) => {
        localStorage.setItem('showStars', e.target.checked);
    });
});

function renderMasterList(regions, scores, container) {
    container.innerHTML = ''; 

    regions.forEach(regionName => {
        // Format Name
        const displayName = regionName.replace(/_/g, ' ');
        const regionKey = regionName.toLowerCase(); // Base key for URL

        // Check Easy status
        const easyKey = `${regionName.toLowerCase()}-easy`;
        const isEasyDone = scores.includes(easyKey);

        // Check Hard status
        const hardKey = `${regionName.toLowerCase()}-hard`;
        const isHardDone = scores.includes(hardKey);

        // Create Card
        const card = document.createElement('div');
        card.classList.add('country-card');

        // Country Title
        const title = document.createElement('div');
        title.classList.add('card-title');
        title.textContent = displayName;
        
        // Apply Font Sizing Logic (Updated values: 11px, 15px, 16px)
        const length = displayName.length;

        if (length > 25) {
            title.style.fontSize = "11px";
        } else if (length > 18) {
            title.style.fontSize = "15px";
        } else{
            title.style.fontSize = "17px";
        }
        
        card.appendChild(title);

        // Badge Container
        const badgeRow = document.createElement('div');
        badgeRow.classList.add('badge-row');

        // Easy Badge
        const easyBadge = document.createElement('div');
        easyBadge.classList.add('status-pill');
        if(isEasyDone) {
            easyBadge.classList.add('easy-done');
            easyBadge.textContent = "Easy ★";
        } else {
            easyBadge.classList.add('locked');
            easyBadge.textContent = "Easy";
        }
        // ADD CLICK LISTENER
        easyBadge.addEventListener('click', () => {
            window.location.href = `quiz.html?region=${regionKey}&difficulty=easy`;
        });
        badgeRow.appendChild(easyBadge);

        // Hard Badge
        const hardBadge = document.createElement('div');
        hardBadge.classList.add('status-pill');
        if(isHardDone) {
            hardBadge.classList.add('hard-done');
            hardBadge.textContent = "Hard 🏆";
        } else {
            hardBadge.classList.add('locked');
            hardBadge.textContent = "Hard";
        }
        // ADD CLICK LISTENER
        hardBadge.addEventListener('click', () => {
            window.location.href = `quiz.html?region=${regionKey}&difficulty=hard`;
        });
        badgeRow.appendChild(hardBadge);

        card.appendChild(badgeRow);
        container.appendChild(card);
    });
}