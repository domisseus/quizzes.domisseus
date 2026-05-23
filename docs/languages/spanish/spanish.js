/* spanish.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DEFINE PATHS 
    const topics = [
        { id: 'count-verbs', path: 'verbs/index.html' },
        { id: 'count-adjectives', path: 'adjectives/index.html' },
        { id: 'count-animals', path: 'animals/index.html' },
        { id: 'count-food', path: 'food/index.html' },
        { id: 'count-body-parts', path: 'body_parts/index.html' },
        { id: 'count-family', path: 'family/index.html' },
        { id: 'count-clothes-colors', path: 'clothes_colors/index.html' },
        { id: 'count-shopping', path: 'shopping/index.html' },
        { id: 'count-time-weather', path: 'time_weather/index.html' },
        { id: 'count-travel', path: 'travel/index.html' },
        { id: 'count-work', path: 'work/index.html' },
        { id: 'count-housing', path: 'housing/index.html' },
        { id: 'count-education', path: 'education/index.html' },
        { id: 'count-environment', path: 'environment/index.html' },
        { id: 'count-free-time-hobbies', path: 'free_time_hobbies/index.html' },
        { id: 'count-things', path: 'things/index.html' },
        { id: 'count-other-things', path: 'other_things/index.html' },
        { id: 'count-other-vocab', path: 'other_vocab/index.html' }
    ];

    // --- NEW: Initialize Total Counters ---
    let totalWordCount = 0; 
    const totalTopics = topics.length;
    // Select the span inside the header: "Vocabulary Topics (18 | ...)"
    const headerTotalSpan = document.querySelector('.column-header span');

    // 2. FETCH COUNTS
    topics.forEach(topic => {
        fetch(topic.path)
            .then(response => {
                if (!response.ok) throw new Error('Page not found');
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Count rows in the vocabulary table
                const rows = doc.querySelectorAll('.vocab-table tbody tr');
                const count = rows.length;

                // Update the individual topic number in the menu
                const span = document.getElementById(topic.id);
                if (span) {
                    span.textContent = count;
                    span.style.opacity = '1'; 
                }

                // --- NEW: Update the Grand Total Header ---
                totalWordCount += count; // Add this topic's count to total
                if (headerTotalSpan) {
                    // Updates text to: "(18 | 1971)"
                    headerTotalSpan.textContent = `(${totalTopics} | ${totalWordCount})`;
                }
            })
            .catch(error => {
                console.log(`Could not load count for ${topic.path}: ${error}`);
            });
    });
});

// 3. SEARCH FUNCTION (Unchanged)
function filterTopics() {
    const input = document.getElementById('topicSearch');
    if(!input) return;

    const filter = input.value.toUpperCase();
    const lists = document.querySelectorAll('.topic-list');
    
    lists.forEach(ul => {
        const li = ul.getElementsByTagName('li');
        for (let i = 0; i < li.length; i++) {
            const a = li[i].getElementsByTagName("a")[0];
            const txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });
}