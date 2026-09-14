// Timezone mapping (City -> IANA timezone)
const timezoneMap = {
    'new york': 'America/New_York',
    'london': 'Europe/London',
    'tokyo': 'Asia/Tokyo',
    'sydney': 'Australia/Sydney',
    'dubai': 'Asia/Dubai',
    'singapore': 'Asia/Singapore',
    'paris': 'Europe/Paris',
    'bangkok': 'Asia/Bangkok',
    'los angeles': 'America/Los_Angeles',
    'chicago': 'America/Chicago',
    'denver': 'America/Denver',
    'toronto': 'America/Toronto',
    'mexico city': 'America/Mexico_City',
    'sao paulo': 'America/Sao_Paulo',
    'buenos aires': 'America/Argentina/Buenos_Aires',
    'london': 'Europe/London',
    'berlin': 'Europe/Berlin',
    'moscow': 'Europe/Moscow',
    'istanbul': 'Europe/Istanbul',
    'cairo': 'Africa/Cairo',
    'johannesburg': 'Africa/Johannesburg',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'bangkok': 'Asia/Bangkok',
    'hong kong': 'Asia/Hong_Kong',
    'shanghai': 'Asia/Shanghai',
    'hong kong': 'Asia/Hong_Kong',
    'auckland': 'Pacific/Auckland',
    'fiji': 'Pacific/Fiji',
};

// Store active clocks
let activeClocks = [];

// Initialize with default clocks
document.addEventListener('DOMContentLoaded', () => {
    addPreset('America/New_York', 'New York');
    addPreset('Europe/London', 'London');
    addPreset('Asia/Tokyo', 'Tokyo');
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

// Add timezone from preset
function addPreset(timezone, cityName) {
    const clockExists = activeClocks.some(c => c.timezone === timezone);
    if (clockExists) {
        alert(`${cityName} is already added!`);
        return;
    }
    
    activeClocks.push({
        timezone: timezone,
        city: cityName,
        id: Date.now()
    });
    
    renderClocks();
}

// Add timezone from user input
function addTimeZone() {
    const input = document.getElementById('cityInput');
    const cityName = input.value.trim();
    
    if (!cityName) {
        alert('Please enter a city name!');
        return;
    }
    
    const timezone = timezoneMap[cityName.toLowerCase()];
    
    if (!timezone) {
        alert(`City "${cityName}" not found. Try: New York, London, Tokyo, Sydney, Dubai, Singapore, Paris, Bangkok, etc.`);
        return;
    }
    
    const clockExists = activeClocks.some(c => c.timezone === timezone);
    if (clockExists) {
        alert(`${cityName} is already added!`);
        return;
    }
    
    activeClocks.push({
        timezone: timezone,
        city: cityName,
        id: Date.now()
    });
    
    input.value = '';
    renderClocks();
}

// Remove a clock
function removeClock(id) {
    activeClocks = activeClocks.filter(c => c.id !== id);
    renderClocks();
}

// Reset all clocks
function resetClocks() {
    activeClocks = [];
    addPreset('America/New_York', 'New York');
    addPreset('Europe/London', 'London');
    addPreset('Asia/Tokyo', 'Tokyo');
    renderClocks();
}

// Render all clock cards
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    
    if (activeClocks.length === 0) {
        grid.innerHTML = '<div class="empty-state">No time zones added. Use the controls above to add one!</div>';
        return;
    }
    
    grid.innerHTML = activeClocks.map(clock => `
        <div class="clock-card">
            <div class="city-name">${clock.city}</div>
            <div class="timezone-info">${clock.timezone}</div>
            <div class="time-display" id="time-${clock.id}">--:--:--</div>
            <div class="date-display" id="date-${clock.id}">-</div>
            <div class="time-period" id="period-${clock.id}">--</div>
            <button class="remove-btn" onclick="removeClock(${clock.id})">Remove</button>
        </div>
    `).join('');
}

// Update all clock displays
function updateAllClocks() {
    activeClocks.forEach(clock => {
        updateClock(clock);
    });
}

// Update individual clock
function updateClock(clock) {
    const now = new Date();
    
    try {
        // Get time in the specific timezone
        const timeString = now.toLocaleString('en-US', {
            timeZone: clock.timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleString('en-US', {
            timeZone: clock.timezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const periodString = now.toLocaleString('en-US', {
            timeZone: clock.timezone,
            hour12: true,
            hour: '2-digit',
        }).split(' ')[1];
        
        // Update DOM
        const timeElement = document.getElementById(`time-${clock.id}`);
        const dateElement = document.getElementById(`date-${clock.id}`);
        const periodElement = document.getElementById(`period-${clock.id}`);
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
        if (periodElement) {
            periodElement.textContent = periodString;
            periodElement.style.background = periodString === 'AM' ? '#667eea' : '#f093fb';
        }
    } catch (error) {
        console.error(`Error updating clock for ${clock.timezone}:`, error);
    }
}

// Allow Enter key to add timezone
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('cityInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTimeZone();
            }
        });
    }
});
