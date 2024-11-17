
import os
from flask import Flask, request, jsonify
from googleapiclient.discovery import build
from yt_dlp import YoutubeDL
import threading
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Replace with your actual API key
YOUR_API_KEY = "AIzaSyC5pEjBG1CnbrCVahcGgXe8lzrL9km9ikE"
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')  # Change this to your desired download path
download_progress = {}  # Global dictionary to hold progress information

# Endpoint to search for YouTube videos
@app.route('/search', methods=['GET'])
def search_videos():
    keyword = request.args.get('keyword')
    page_token = request.args.get('page_token', None)

    if not keyword:
        return jsonify({'error': 'Keyword is required'}), 400

    youtube = build('youtube', 'v3', developerKey=YOUR_API_KEY)
    results = []
    total_results = 0

    try:
        while total_results < 500:
            yt_request = youtube.search().list(
                q=keyword,
                part='snippet',
                maxResults=50,  # Fetch up to 50 results at a time
                pageToken=page_token,
                type='video'
            )
            response = yt_request.execute()
            
            # Collect results
            for item in response.get('items', []):
                if total_results >= 500:  # Stop if we reach 500 total results
                    break
                results.append({
                    'title': item['snippet']['title'],
                    'videoId': item['id']['videoId'],
                    'videoUrl': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    'thumbnailUrl': item['snippet']['thumbnails']['default']['url'],  # Thumbnail URL
                    'description': item['snippet'].get('description', 'No description available')  # Video description
                })
                total_results += 1

            # Check for next page token
            page_token = response.get('nextPageToken')
            if not page_token or total_results >= 500:
                break

        return jsonify({
            'results': results,
            'nextPageToken': page_token if total_results < 500 else None,  # Return the token if more results are available
            'totalResults': total_results  # Total results count
        })

    except Exception as e:
        if "quotaExceeded" in str(e):
            return jsonify({'error': 'Quota exceeded. Try again later.'}), 403
        return jsonify({'error': f"Error during search: {str(e)}"}), 500

# Endpoint to download videos
@app.route('/download', methods=['POST'])
def download_video():
    global download_progress
    download_progress = {}  # Reset progress

    data = request.get_json()
    video_urls = data.get('videoUrls', [])
    format_type = data.get('formatType', 'best')
    
    if not video_urls:
        return jsonify({'error': 'Video URLs are required'}), 400

    # Create the download path if it doesn't exist
    os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

    def download():
        ydl_opts = {
            'format': format_type,
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
            'ignoreerrors': True,
            'progress_hooks': [hook],  # Add progress hook
            'verbose': True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            for url in video_urls:
                try:
                    download_progress[url] = 0  # Initialize progress for this video
                    ydl.download([url])
                except Exception as e:
                    print(f"Error downloading {url}: {str(e)}")

    def hook(d):
        if d['status'] == 'downloading':
            url = d['filename']
            progress = int(d['downloaded_bytes'] / d['total_bytes'] * 100)
            download_progress[url] = progress  # Update progress for the specific URL

    # Start download in a separate thread to not block the request
    threading.Thread(target=download).start()
    
    return jsonify({'message': 'Download started'}), 200

# Endpoint to get download progress
@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify(download_progress)

# Start Flask app
if __name__ == "__main__":
    app.run(debug=True)