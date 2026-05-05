"""
HSK Check Backend API
Flask REST API for HSK exam schedule checking
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import requests
import os
from apscheduler.schedulers.background import BackgroundScheduler

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///hsk_check.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# Initialize database
db = SQLAlchemy(app)

# ============================================
# DATABASE MODELS
# ============================================

class RSSFeed(db.Model):
    """RSS Feed sources"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(500), nullable=False, unique=True)
    page_url = db.Column(db.String(500))
    color1 = db.Column(db.String(20), default='#667eea')
    color2 = db.Column(db.String(20), default='#764ba2')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'page_url': self.page_url,
            'colors': [self.color1, self.color2],
            'active': self.active,
            'created_at': self.created_at.isoformat()
        }


class Post(db.Model):
    """Cached posts from RSS feeds"""
    id = db.Column(db.String(100), primary_key=True)
    feed_id = db.Column(db.Integer, db.ForeignKey('rss_feed.id'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    content_text = db.Column(db.Text)
    content_html = db.Column(db.Text)
    url = db.Column(db.String(500))
    image = db.Column(db.String(500))
    date_published = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    feed = db.relationship('RSSFeed', backref='posts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'feed_id': self.feed_id,
            'feed_name': self.feed.name,
            'title': self.title,
            'content_text': self.content_text,
            'content_html': self.content_html,
            'url': self.url,
            'image': self.image,
            'date_published': self.date_published.isoformat() if self.date_published else None,
            'created_at': self.created_at.isoformat()
        }


class EmailSubscription(db.Model):
    """Email subscriptions"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    frequency = db.Column(db.String(20), default='daily')  # immediate, daily, weekly
    active = db.Column(db.Boolean, default=True)
    last_sent = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'frequency': self.frequency,
            'active': self.active,
            'last_sent': self.last_sent.isoformat() if self.last_sent else None,
            'created_at': self.created_at.isoformat()
        }


# ============================================
# HELPER FUNCTIONS
# ============================================

def fetch_rss_feed(feed_url):
    """Fetch and parse RSS feed"""
    try:
        response = requests.get(feed_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching feed {feed_url}: {e}")
        return None


def update_posts_from_feed(feed):
    """Update posts from a specific feed"""
    data = fetch_rss_feed(feed.url)
    if not data or 'items' not in data:
        return 0
    
    new_posts = 0
    for item in data['items']:
        post_id = item.get('id')
        if not post_id:
            continue
        
        # Check if post already exists
        existing_post = Post.query.get(post_id)
        if existing_post:
            continue
        
        # Create new post
        post = Post(
            id=post_id,
            feed_id=feed.id,
            title=item.get('title', 'No title'),
            content_text=item.get('content_text', ''),
            content_html=item.get('content_html', ''),
            url=item.get('url', ''),
            image=item.get('image', ''),
            date_published=datetime.fromisoformat(item['date_published'].replace('Z', '+00:00')) if item.get('date_published') else None
        )
        db.session.add(post)
        new_posts += 1
    
    db.session.commit()
    return new_posts


def update_all_feeds():
    """Update posts from all active feeds"""
    feeds = RSSFeed.query.filter_by(active=True).all()
    total_new = 0
    for feed in feeds:
        new_posts = update_posts_from_feed(feed)
        total_new += new_posts
        print(f"Updated {feed.name}: {new_posts} new posts")
    return total_new


# ============================================
# API ROUTES
# ============================================

@app.route('/')
def index():
    """API info"""
    return jsonify({
        'name': 'HSK Check API',
        'version': '1.0.0',
        'endpoints': {
            'feeds': '/api/feeds',
            'posts': '/api/posts',
            'subscriptions': '/api/subscriptions'
        }
    })


@app.route('/api/feeds', methods=['GET'])
def get_feeds():
    """Get all RSS feeds"""
    feeds = RSSFeed.query.filter_by(active=True).all()
    return jsonify([feed.to_dict() for feed in feeds])


@app.route('/api/feeds', methods=['POST'])
def create_feed():
    """Create new RSS feed"""
    data = request.json
    
    # Validate required fields
    if not data.get('name') or not data.get('url'):
        return jsonify({'error': 'Name and URL are required'}), 400
    
    # Check if feed already exists
    existing = RSSFeed.query.filter_by(url=data['url']).first()
    if existing:
        return jsonify({'error': 'Feed already exists'}), 400
    
    feed = RSSFeed(
        name=data['name'],
        url=data['url'],
        page_url=data.get('page_url', ''),
        color1=data.get('color1', '#667eea'),
        color2=data.get('color2', '#764ba2')
    )
    
    db.session.add(feed)
    db.session.commit()
    
    # Fetch initial posts
    update_posts_from_feed(feed)
    
    return jsonify(feed.to_dict()), 201


@app.route('/api/feeds/<int:feed_id>', methods=['DELETE'])
def delete_feed(feed_id):
    """Delete RSS feed"""
    feed = RSSFeed.query.get_or_404(feed_id)
    feed.active = False
    db.session.commit()
    return jsonify({'message': 'Feed deleted successfully'})


@app.route('/api/posts', methods=['GET'])
def get_posts():
    """Get all posts with optional filters"""
    # Query parameters
    feed_id = request.args.get('feed_id', type=int)
    search = request.args.get('search', '')
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # Build query
    query = Post.query.join(RSSFeed).filter(RSSFeed.active == True)
    
    if feed_id:
        query = query.filter(Post.feed_id == feed_id)
    
    if search:
        search_term = f'%{search}%'
        query = query.filter(
            db.or_(
                Post.title.ilike(search_term),
                Post.content_text.ilike(search_term)
            )
        )
    
    # Order by date
    query = query.order_by(Post.date_published.desc())
    
    # Pagination
    total = query.count()
    posts = query.limit(limit).offset(offset).all()
    
    return jsonify({
        'total': total,
        'limit': limit,
        'offset': offset,
        'posts': [post.to_dict() for post in posts]
    })


@app.route('/api/posts/refresh', methods=['POST'])
def refresh_posts():
    """Manually refresh posts from all feeds"""
    new_posts = update_all_feeds()
    return jsonify({
        'message': f'Refreshed successfully',
        'new_posts': new_posts
    })


@app.route('/api/subscriptions', methods=['GET'])
def get_subscriptions():
    """Get all email subscriptions"""
    subs = EmailSubscription.query.filter_by(active=True).all()
    return jsonify([sub.to_dict() for sub in subs])


@app.route('/api/subscriptions', methods=['POST'])
def create_subscription():
    """Create new email subscription"""
    data = request.json
    
    # Validate required fields
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
    
    # Check if subscription already exists
    existing = EmailSubscription.query.filter_by(email=data['email']).first()
    if existing:
        if existing.active:
            return jsonify({'error': 'Email already subscribed'}), 400
        else:
            # Reactivate
            existing.active = True
            existing.frequency = data.get('frequency', 'daily')
            db.session.commit()
            return jsonify(existing.to_dict())
    
    subscription = EmailSubscription(
        name=data['name'],
        email=data['email'],
        frequency=data.get('frequency', 'daily')
    )
    
    db.session.add(subscription)
    db.session.commit()
    
    return jsonify(subscription.to_dict()), 201


@app.route('/api/subscriptions/<int:sub_id>', methods=['DELETE'])
def delete_subscription(sub_id):
    """Unsubscribe email"""
    sub = EmailSubscription.query.get_or_404(sub_id)
    sub.active = False
    db.session.commit()
    return jsonify({'message': 'Unsubscribed successfully'})


@app.route('/api/subscriptions/email/<email>', methods=['DELETE'])
def unsubscribe_by_email(email):
    """Unsubscribe by email address"""
    sub = EmailSubscription.query.filter_by(email=email, active=True).first()
    if not sub:
        return jsonify({'error': 'Subscription not found'}), 404
    
    sub.active = False
    db.session.commit()
    return jsonify({'message': 'Unsubscribed successfully'})


# ============================================
# BACKGROUND TASKS
# ============================================

def scheduled_feed_update():
    """Scheduled task to update feeds"""
    with app.app_context():
        print(f"[{datetime.now()}] Running scheduled feed update...")
        new_posts = update_all_feeds()
        print(f"[{datetime.now()}] Updated: {new_posts} new posts")


# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=scheduled_feed_update, trigger="interval", minutes=5)
scheduler.start()


# ============================================
# INITIALIZATION
# ============================================

def init_db():
    """Initialize database with default feeds"""
    with app.app_context():
        db.create_all()
        
        # Check if feeds already exist
        if RSSFeed.query.count() > 0:
            return
        
        # Add default feeds
        default_feeds = [
            {
                'name': 'ULIS - ĐH Ngoại ngữ ĐHQGHN',
                'url': 'https://rss.app/feeds/v1.1/AgH8JEE481LUB8cs.json',
                'page_url': 'https://www.facebook.com/profile.php?id=100065248250882',
                'color1': '#667eea',
                'color2': '#764ba2'
            },
            {
                'name': 'HANU - Viện Khổng Tử',
                'url': 'https://rss.app/feeds/v1.1/8p6E2WY0mwptt3q9.json',
                'page_url': '',
                'color1': '#f093fb',
                'color2': '#f5576c'
            },
            {
                'name': 'HNUE - ĐH Sư phạm HN',
                'url': 'https://rss.app/feeds/v1.1/nGNlg9y9t8HP6Kd8.json',
                'page_url': '',
                'color1': '#4facfe',
                'color2': '#00f2fe'
            }
        ]
        
        for feed_data in default_feeds:
            feed = RSSFeed(**feed_data)
            db.session.add(feed)
        
        db.session.commit()
        print("Database initialized with default feeds")
        
        # Fetch initial posts
        update_all_feeds()


# ============================================
# RUN APP
# ============================================

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)

# Made with Bob
