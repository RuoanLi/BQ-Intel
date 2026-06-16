// ----------------------------------------------------
// APPLICATION STATE
// ----------------------------------------------------
const state = {
    updates: [],
    filteredUpdates: [],
    currentFilter: 'all',
    searchQuery: '',
    selectedUpdate: null
};

// ----------------------------------------------------
// DOM ELEMENTS
// ----------------------------------------------------
const elements = {
    refreshBtn: document.getElementById('refresh-btn'),
    statusText: document.getElementById('status-text'),
    statusDot: document.querySelector('.status-dot'),
    
    // Stats cards
    statTotal: document.getElementById('stat-total'),
    statFeatures: document.getElementById('stat-features'),
    statChanges: document.getElementById('stat-changes'),
    statIssues: document.getElementById('stat-issues'),
    statAnnouncements: document.getElementById('stat-announcements'),
    statCards: document.querySelectorAll('.stat-card'),
    
    // Control panel
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search'),
    filterChips: document.querySelectorAll('.chip'),
    
    // Feed content
    feedGrid: document.getElementById('feed-grid'),
    loadingSkeleton: document.getElementById('loading-skeleton'),
    emptyState: document.getElementById('empty-state'),
    
    // Modal
    tweetModal: document.getElementById('tweet-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    tweetTextarea: document.getElementById('tweet-textarea'),
    charCounter: document.getElementById('char-counter'),
    charWarning: document.getElementById('char-warning'),
    copyTweetBtn: document.getElementById('copy-tweet-btn'),
    copyTweetText: document.getElementById('copy-tweet-text'),
    postTweetBtn: document.getElementById('post-tweet-btn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    fetchFeedData(false);
});

// ----------------------------------------------------
// EVENT LISTENERS
// ----------------------------------------------------
function setupEventListeners() {
    // Refresh button
    elements.refreshBtn.addEventListener('click', () => {
        fetchFeedData(true);
    });

    // Search input
    elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        toggleClearSearchButton();
        applyFiltersAndSearch();
    });

    // Clear search button
    elements.clearSearchBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        state.searchQuery = '';
        toggleClearSearchButton();
        applyFiltersAndSearch();
        elements.searchInput.focus();
    });

    // Filter Chips
    elements.filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            setFilter(filter);
        });
    });

    // Stats Cards (also act as filters)
    elements.statCards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.getAttribute('data-filter');
            setFilter(filter);
        });
    });

    // Modal Close
    elements.closeModalBtn.addEventListener('click', closeTweetModal);
    
    // Close modal when clicking outside content area
    elements.tweetModal.addEventListener('click', (e) => {
        if (e.target === elements.tweetModal) {
            closeTweetModal();
        }
    });

    // Textarea input monitoring
    elements.tweetTextarea.addEventListener('input', () => {
        updateCharCount();
    });

    // Copy tweet button
    elements.copyTweetBtn.addEventListener('click', () => {
        const text = elements.tweetTextarea.value;
        copyToClipboard(text, () => {
            const originalText = elements.copyTweetText.textContent;
            elements.copyTweetText.textContent = "Copied!";
            showToast("Tweet text copied to clipboard!");
            setTimeout(() => {
                elements.copyTweetText.textContent = originalText;
            }, 2000);
        });
    });

    // Post to X button
    elements.postTweetBtn.addEventListener('click', () => {
        const text = elements.tweetTextarea.value;
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterIntentUrl, '_blank');
        closeTweetModal();
    });
}

// ----------------------------------------------------
// DATA FETCHING & PARSING
// ----------------------------------------------------
async function fetchFeedData(forceRefresh = false) {
    setLoadingState(true);
    
    const url = `/api/feed${forceRefresh ? '?refresh=true' : ''}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load feed data.");
        
        const data = await response.json();
        
        if (data.success) {
            state.updates = data.updates;
            updateStats();
            applyFiltersAndSearch();
            
            // Update last updated status
            const date = new Date(data.timestamp * 1000);
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const cacheStatus = data.cached ? " (Cached)" : " (Freshly Fetched)";
            elements.statusText.textContent = `Feed updated at ${formattedTime}${cacheStatus}`;
            
            // Set status dot to green active
            elements.statusDot.className = 'status-dot active';
        } else {
            throw new Error(data.error || "Unknown error occurred.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showToast(`Error: ${error.message}`);
        elements.statusText.textContent = "Error loading updates";
        elements.statusDot.className = 'status-dot'; // Red / inactive
        
        // If state already has data (fallback from cache), keep showing it
        if (state.updates.length === 0) {
            elements.feedGrid.style.display = 'none';
            elements.emptyState.style.display = 'block';
        }
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(isLoading) {
    const spinner = elements.refreshBtn.querySelector('.spinner-icon');
    
    if (isLoading) {
        elements.refreshBtn.disabled = true;
        spinner.classList.add('loading');
        elements.statusDot.className = 'status-dot loading';
        elements.statusText.textContent = "Syncing release notes...";
        
        // Show skeleton, hide grid and empty state
        elements.loadingSkeleton.style.display = 'grid';
        elements.feedGrid.style.display = 'none';
        elements.emptyState.style.display = 'none';
    } else {
        elements.refreshBtn.disabled = false;
        spinner.classList.remove('loading');
        elements.loadingSkeleton.style.display = 'none';
    }
}

// ----------------------------------------------------
// STATISTICS & SEARCH FILTERS
// ----------------------------------------------------
function updateStats() {
    const counts = {
        total: state.updates.length,
        Feature: 0,
        Change: 0,
        Issue: 0,
        Announcement: 0
    };
    
    state.updates.forEach(update => {
        // Count for stats
        if (counts[update.type] !== undefined) {
            counts[update.type]++;
        }
    });
    
    elements.statTotal.textContent = counts.total;
    elements.statFeatures.textContent = counts.Feature;
    elements.statChanges.textContent = counts.Change;
    elements.statIssues.textContent = counts.Issue;
    elements.statAnnouncements.textContent = counts.Announcement;
}

function setFilter(filter) {
    state.currentFilter = filter;
    
    // Update active filter chip class
    elements.filterChips.forEach(chip => {
        if (chip.getAttribute('data-filter') === filter) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    // Update active state cards class
    elements.statCards.forEach(card => {
        if (card.getAttribute('data-filter') === filter) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    applyFiltersAndSearch();
}

function toggleClearSearchButton() {
    if (state.searchQuery.length > 0) {
        elements.clearSearchBtn.style.display = 'flex';
    } else {
        elements.clearSearchBtn.style.display = 'none';
    }
}

function applyFiltersAndSearch() {
    // 1. Filter by category
    let results = state.updates;
    if (state.currentFilter !== 'all') {
        results = results.filter(update => update.type.toLowerCase() === state.currentFilter.toLowerCase());
    }
    
    // 2. Filter by search keyword
    if (state.searchQuery.length > 0) {
        results = results.filter(update => 
            update.text.toLowerCase().includes(state.searchQuery) ||
            update.type.toLowerCase().includes(state.searchQuery) ||
            update.date.toLowerCase().includes(state.searchQuery)
        );
    }
    
    state.filteredUpdates = results;
    renderGrid();
}

// ----------------------------------------------------
// UI RENDERING
// ----------------------------------------------------
function renderGrid() {
    elements.feedGrid.innerHTML = '';
    
    if (state.filteredUpdates.length === 0) {
        elements.feedGrid.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.feedGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';
    
    state.filteredUpdates.forEach(update => {
        const card = createCardElement(update);
        elements.feedGrid.appendChild(card);
    });
}

function createCardElement(update) {
    const card = document.createElement('div');
    card.className = `update-card card-${update.type.toLowerCase()}`;
    card.setAttribute('data-id', update.id);
    
    // Render HTML content safely
    card.innerHTML = `
        <div>
            <div class="card-header">
                <span class="type-badge badge-${update.type.toLowerCase()}">${update.type}</span>
                <span class="card-date">${update.date}</span>
            </div>
            <div class="card-body">
                ${update.html}
            </div>
        </div>
        <div class="card-actions">
            <button class="btn-icon btn-view-src" title="View official release documentation" data-link="${update.link}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </button>
            <button class="btn-icon btn-copy-src" title="Copy update link">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            </button>
            <button class="btn btn-tweet" title="Tweet about this update">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                <span>Tweet</span>
            </button>
        </div>
    `;
    
    // Attach event handlers to card buttons
    card.querySelector('.btn-view-src').addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(update.link, '_blank');
    });
    
    card.querySelector('.btn-copy-src').addEventListener('click', (e) => {
        e.stopPropagation();
        const fullLink = `${update.link}#${update.id}`;
        copyToClipboard(fullLink, () => {
            showToast("Direct update link copied!");
        });
    });
    
    card.querySelector('.btn-tweet').addEventListener('click', (e) => {
        e.stopPropagation();
        openTweetModal(update);
    });
    
    return card;
}

// ----------------------------------------------------
// TWEET MODAL & GENERATION LOGIC
// ----------------------------------------------------
function openTweetModal(update) {
    state.selectedUpdate = update;
    
    // Pre-populate tweet draft text
    const tweetText = generateTweetText(update);
    elements.tweetTextarea.value = tweetText;
    
    updateCharCount();
    
    // Show modal
    elements.tweetModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Focus textarea
    setTimeout(() => {
        elements.tweetTextarea.focus();
    }, 100);
}

function closeTweetModal() {
    elements.tweetModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
    state.selectedUpdate = null;
}

function generateTweetText(update) {
    let prefix = "";
    switch (update.type) {
        case "Feature":
            prefix = "🚀 New #BigQuery Feature";
            break;
        case "Change":
            prefix = "🔧 #BigQuery Change";
            break;
        case "Announcement":
            prefix = "📢 #BigQuery Announcement";
            break;
        case "Issue":
            prefix = "⚠️ #BigQuery Issue Update";
            break;
        case "Breaking":
            prefix = "🚨 #BigQuery Breaking Change";
            break;
        default:
            prefix = "ℹ️ #BigQuery Update";
    }
    
    prefix += ` (${update.date}):\n\n`;
    
    // We add an anchor link if the id can point directly to it
    const directLink = `${update.link}`;
    const suffix = `\n\nMore details: ${directLink}`;
    
    // Max size of the central description text to fit in X's 280-char limit
    // We leave 5 extra characters for safety
    const allowedLength = 280 - prefix.length - suffix.length - 5;
    
    let description = update.text;
    if (description.length > allowedLength) {
        description = description.substring(0, allowedLength - 3) + "...";
    }
    
    return `${prefix}${description}${suffix}`;
}

function updateCharCount() {
    const len = elements.tweetTextarea.value.length;
    elements.charCounter.textContent = `${len} / 280`;
    
    if (len > 280) {
        elements.charCounter.classList.add('warning');
        elements.charWarning.style.display = 'block';
    } else {
        elements.charCounter.classList.remove('warning');
        elements.charWarning.style.display = 'none';
    }
}

// ----------------------------------------------------
// HELPER UTILITIES
// ----------------------------------------------------
function copyToClipboard(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(callback).catch(err => {
            console.error("Clipboard copy failed:", err);
            fallbackCopyToClipboard(text, callback);
        });
    } else {
        fallbackCopyToClipboard(text, callback);
    }
}

function fallbackCopyToClipboard(text, callback) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) callback();
        else throw new Error("Copy command unsuccessful");
    } catch (err) {
        console.error('Fallback copy failed', err);
        showToast("Unable to copy to clipboard.");
    }
    document.body.removeChild(textarea);
}

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('active');
    
    // Clear previous timeout if any
    if (state.toastTimeout) {
        clearTimeout(state.toastTimeout);
    }
    
    state.toastTimeout = setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 3000);
}
