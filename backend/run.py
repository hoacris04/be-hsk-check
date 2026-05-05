"""
Simple run script for development
"""
from app import app, init_db

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("🚀 HSK Check Backend API")
    print("=" * 50)
    print("📡 Server running at: http://localhost:5000")
    print("📖 API Docs: http://localhost:5000/")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)

# Made with Bob
