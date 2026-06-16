import os
import time
import json
import xml.etree.ElementTree as ET
import re
import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"
CACHE_FILE = "feed_cache.json"
CACHE_DURATION = 300  # 5 minutes in seconds

def clean_html_to_plain_text(html_str):
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', html_str)
    # Decode common HTML entities
    clean_text = clean_text.replace('&nbsp;', ' ')
    clean_text = clean_text.replace('&amp;', '&')
    clean_text = clean_text.replace('&lt;', '<')
    clean_text = clean_text.replace('&gt;', '>')
    clean_text = clean_text.replace('&quot;', '"')
    clean_text = clean_text.replace('&#39;', "'")
    # Clean up whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

def parse_html_content(html_content, date_str, link_url):
    pattern = re.compile(r'<h3>(.*?)</h3>', re.IGNORECASE)
    matches = list(pattern.finditer(html_content))
    
    updates = []
    
    for i, match in enumerate(matches):
        update_type = match.group(1).strip()
        start_pos = match.end()
        end_pos = matches[i+1].start() if i + 1 < len(matches) else len(html_content)
        
        chunk = html_content[start_pos:end_pos].strip()
        plain_text = clean_html_to_plain_text(chunk)
        
        # Build unique ID
        date_clean = date_str.replace(' ', '_').replace(',', '')
        update_id = f"{date_clean}_{update_type.replace(' ', '_')}_{i}"
        
        updates.append({
            'id': update_id,
            'type': update_type,
            'html': chunk,
            'text': plain_text,
            'date': date_str,
            'link': link_url
        })
        
    if not updates and html_content.strip():
        plain_text = clean_html_to_plain_text(html_content)
        date_clean = date_str.replace(' ', '_').replace(',', '')
        updates.append({
            'id': f"{date_clean}_Info_0",
            'type': 'Info',
            'html': html_content,
            'text': plain_text,
            'date': date_str,
            'link': link_url
        })
        
    return updates

def fetch_and_parse_feed():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(FEED_URL, headers=headers)
    response.raise_for_status()
    
    # Parse XML
    root = ET.fromstring(response.content)
    
    # Atom namespace
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    
    all_updates = []
    
    for entry in root.findall('atom:entry', ns):
        title = entry.find('atom:title', ns)
        date_str = title.text if title is not None else "Unknown Date"
        
        link = entry.find('atom:link[@rel="alternate"]', ns)
        if link is None:
            link = entry.find('atom:link', ns)
        link_url = link.get('href') if link is not None else "https://docs.cloud.google.com/bigquery/docs/release-notes"
        
        content = entry.find('atom:content', ns)
        html_content = content.text if content is not None else ""
        
        # Parse content into individual updates
        updates = parse_html_content(html_content, date_str, link_url)
        all_updates.extend(updates)
        
    return all_updates

def get_feed_data(force_refresh=False):
    # Check cache file
    if not force_refresh and os.path.exists(CACHE_FILE):
        mtime = os.path.getmtime(CACHE_FILE)
        if time.time() - mtime < CACHE_DURATION:
            try:
                with open(CACHE_FILE, 'r') as f:
                    return json.load(f), True
            except Exception:
                pass
                
    # Fetch fresh data
    try:
        updates = fetch_and_parse_feed()
        with open(CACHE_FILE, 'w') as f:
            json.dump(updates, f, indent=2)
        return updates, False
    except Exception as e:
        # Fallback to cache if request fails
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'r') as f:
                    return json.load(f), True
            except Exception:
                pass
        raise e

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/feed')
def get_feed():
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    try:
        updates, cached = get_feed_data(force_refresh)
        return jsonify({
            'success': True,
            'cached': cached,
            'timestamp': os.path.getmtime(CACHE_FILE) if os.path.exists(CACHE_FILE) else time.time(),
            'updates': updates
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
