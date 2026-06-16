// ----------------------------------------------------
// BILINGUAL TRANSLATIONS
// ----------------------------------------------------
const translations = {
    en: {
        title: "BigQuery Release Pulse",
        subtitle: "Track the latest Google Cloud BigQuery releases and share them instantly",
        statusChecking: "Checking feed...",
        statusUpdating: "Syncing release notes...",
        statusUpdated: "Feed updated at {time}{status}",
        statusError: "Error loading updates",
        refresh: "Refresh",
        totalUpdates: "Total Updates",
        features: "Features",
        changes: "Changes",
        issues: "Issues",
        announcements: "Announcements",
        breaking: "Breaking",
        searchPlaceholder: "Search release notes by keyword (e.g., Gemini, Iceberg, UDF)...",
        filterLabel: "Filter:",
        all: "All",
        noUpdatesTitle: "No updates found",
        noUpdatesDesc: "Try adjusting your search terms or filters, or hit refresh to pull the latest feed.",
        viewDocTitle: "View official release documentation",
        copyLinkTitle: "Copy update link",
        tweetTitle: "Tweet about this update",
        tweetButton: "Tweet",
        toastCopiedLink: "Direct update link copied!",
        toastCopiedTweet: "Tweet text copied to clipboard!",
        toastCopyError: "Unable to copy to clipboard.",
        modalHeader: "Draft Tweet",
        modalPlaceholder: "What's happening?",
        modalWarning: "⚠️ Warning: Tweet exceeds X's standard character limit of 280 characters.",
        btnCopyText: "Copy Text",
        btnCopyTextSuccess: "Copied!",
        btnPostX: "Post to X",
        footerText: "BigQuery Release Pulse &bull; Built with Flask &amp; Vanilla Web Stack &bull; Google Cloud Release Notes Feed",
        
        // Card Badges
        badge_feature: "Feature",
        badge_change: "Change",
        badge_announcement: "Announcement",
        badge_issue: "Issue",
        badge_breaking: "Breaking",
        badge_info: "Info",

        // Tweet templates
        tweetPrefixFeature: "🚀 New #BigQuery Feature",
        tweetPrefixChange: "🔧 #BigQuery Change",
        tweetPrefixAnnouncement: "📢 #BigQuery Announcement",
        tweetPrefixIssue: "⚠️ #BigQuery Issue Update",
        tweetPrefixBreaking: "🚨 #BigQuery Breaking Change",
        tweetPrefixDefault: "ℹ️ #BigQuery Update",
        tweetSuffix: "More details: "
    },
    zh: {
        title: "BigQuery 发布脉搏",
        subtitle: "追踪最新的 Google Cloud BigQuery 发布日志并即时分享",
        statusChecking: "正在同步数据...",
        statusUpdating: "正在拉取发布日志...",
        statusUpdated: "数据更新于 {time}{status}",
        statusError: "加载数据源失败",
        refresh: "刷新",
        totalUpdates: "所有更新",
        features: "新功能",
        changes: "常规变更",
        issues: "修复与问题",
        announcements: "官方公告",
        breaking: "重大变更",
        searchPlaceholder: "按关键字搜索发布日志（例如 Gemini、Iceberg、UDF）...",
        filterLabel: "筛选：",
        all: "全部显示",
        noUpdatesTitle: "未找到相关更新",
        noUpdatesDesc: "尝试调整您的搜索词或过滤器，或者点击刷新拉取最新订阅。",
        viewDocTitle: "查看官方发布文档",
        copyLinkTitle: "复制更新链接",
        tweetTitle: "分享这条更新到 X (Twitter)",
        tweetButton: "推特分享",
        toastCopiedLink: "已复制直接更新链接！",
        toastCopiedTweet: "推文草稿已复制到剪贴板！",
        toastCopyError: "复制到剪贴板失败。",
        modalHeader: "拟写推文",
        modalPlaceholder: "分享新鲜事...",
        modalWarning: "⚠️ 警告：推文已超过 X 的 280 字符标准限制。",
        btnCopyText: "复制文本",
        btnCopyTextSuccess: "已复制！",
        btnPostX: "发布至 X",
        footerText: "BigQuery 发布脉搏 &bull; 基于 Flask &amp; 原生 Web 栈构建 &bull; 订阅自 Google Cloud 官方 Release Notes",

        // Card Badges
        badge_feature: "新功能",
        badge_change: "变更",
        badge_announcement: "公告",
        badge_issue: "问题修复",
        badge_breaking: "重大变更",
        badge_info: "其他说明",

        // Tweet templates
        tweetPrefixFeature: "🚀 #BigQuery 新功能",
        tweetPrefixChange: "🔧 #BigQuery 变更",
        tweetPrefixAnnouncement: "📢 #BigQuery 官方公告",
        tweetPrefixIssue: "⚠️ #BigQuery 问题修复/更新",
        tweetPrefixBreaking: "🚨 #BigQuery 重大变更",
        tweetPrefixDefault: "ℹ️ #BigQuery 更新",
        tweetSuffix: "更多详情: "
    }
};

// ----------------------------------------------------
// APPLICATION STATE
// ----------------------------------------------------
const state = {
    updates: [],
    filteredUpdates: [],
    currentFilter: 'all',
    searchQuery: '',
    selectedUpdate: null,
    currentLang: 'en',
    lastSyncTimestamp: null,
    lastSyncCached: false,
    toastTimeout: null
};

// ----------------------------------------------------
// DOM ELEMENTS
// ----------------------------------------------------
const elements = {
    refreshBtn: document.getElementById('refresh-btn'),
    statusText: document.getElementById('status-text'),
    statusDot: document.querySelector('.status-dot'),
    
    // Lang switcher
    langEnBtn: document.getElementById('lang-en-btn'),
    langZhBtn: document.getElementById('lang-zh-btn'),
    
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
    // Language switcher triggers
    elements.langEnBtn.addEventListener('click', () => switchLanguage('en'));
    elements.langZhBtn.addEventListener('click', () => switchLanguage('zh'));

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
            elements.copyTweetText.textContent = translations[state.currentLang].btnCopyTextSuccess;
            showToast(translations[state.currentLang].toastCopiedTweet);
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
// BILINGUAL LANGUAGE SWITCHING LOGIC
// ----------------------------------------------------
function switchLanguage(lang) {
    if (state.currentLang === lang) return;
    
    state.currentLang = lang;
    
    // Toggle active classes on lang buttons
    if (lang === 'en') {
        elements.langEnBtn.classList.add('active');
        elements.langZhBtn.classList.remove('active');
    } else {
        elements.langZhBtn.classList.add('active');
        elements.langEnBtn.classList.remove('active');
    }
    
    // Update document static texts
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    
    // Update search input placeholder
    elements.searchInput.placeholder = translations[lang].searchPlaceholder;
    
    // Update status text
    updateStatusText();
    
    // Re-render feed elements (since badge texts are language-specific)
    applyFiltersAndSearch();
    
    // If modal is open, regenerate the tweet draft in the target language
    if (state.selectedUpdate) {
        const tweetText = generateTweetText(state.selectedUpdate);
        elements.tweetTextarea.value = tweetText;
        updateCharCount();
    }
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
            state.lastSyncTimestamp = data.timestamp;
            state.lastSyncCached = data.cached;
            
            updateStats();
            applyFiltersAndSearch();
            updateStatusText();
            
            // Set status dot to green active
            elements.statusDot.className = 'status-dot active';
        } else {
            throw new Error(data.error || "Unknown error occurred.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showToast(state.currentLang === 'zh' ? `错误: ${error.message}` : `Error: ${error.message}`);
        elements.statusText.textContent = translations[state.currentLang].statusError;
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

function updateStatusText() {
    if (!state.lastSyncTimestamp) return;
    
    const date = new Date(state.lastSyncTimestamp * 1000);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let statusText = translations[state.currentLang].statusUpdated;
    statusText = statusText.replace('{time}', formattedTime);
    
    let cacheInfo = "";
    if (state.currentLang === 'zh') {
        cacheInfo = state.lastSyncCached ? " (缓存数据)" : " (实时同步)";
    } else {
        cacheInfo = state.lastSyncCached ? " (Cached)" : " (Fresh)";
    }
    
    statusText = statusText.replace('{status}', cacheInfo);
    elements.statusText.textContent = statusText;
}

function setLoadingState(isLoading) {
    const spinner = elements.refreshBtn.querySelector('.spinner-icon');
    
    if (isLoading) {
        elements.refreshBtn.disabled = true;
        spinner.classList.add('loading');
        elements.statusDot.className = 'status-dot loading';
        elements.statusText.textContent = translations[state.currentLang].statusUpdating;
        
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
    
    // Translate the type badge on rendering
    const badgeTextKey = 'badge_' + update.type.toLowerCase();
    const badgeLabel = translations[state.currentLang][badgeTextKey] || update.type;
    
    // Render HTML content safely
    card.innerHTML = `
        <div>
            <div class="card-header">
                <span class="type-badge badge-${update.type.toLowerCase()}">${badgeLabel}</span>
                <span class="card-date">${update.date}</span>
            </div>
            <div class="card-body">
                ${update.html}
            </div>
        </div>
        <div class="card-actions">
            <button class="btn-icon btn-view-src" title="${translations[state.currentLang].viewDocTitle}" data-link="${update.link}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </button>
            <button class="btn-icon btn-copy-src" title="${translations[state.currentLang].copyLinkTitle}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            </button>
            <button class="btn btn-tweet" title="${translations[state.currentLang].tweetTitle}">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                <span>${translations[state.currentLang].tweetButton}</span>
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
            showToast(translations[state.currentLang].toastCopiedLink);
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
    elements.tweetTextarea.placeholder = translations[state.currentLang].modalPlaceholder;
    
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
    const lang = state.currentLang;
    let prefix = "";
    
    // Grab the appropriate prefix in the active language
    const prefixKey = 'tweetPrefix' + update.type;
    prefix = translations[lang][prefixKey] || translations[lang].tweetPrefixDefault;
    
    prefix += ` (${update.date}):\n\n`;
    
    const directLink = `${update.link}`;
    const suffix = `\n\n${translations[lang].tweetSuffix}${directLink}`;
    
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
        showToast(translations[state.currentLang].toastCopyError);
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
