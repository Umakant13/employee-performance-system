import requests
import time
import schedule

BACKEND_URL = "https://employee-backend-wtwb.onrender.com"  # Change this

def ping_backend():
    """Ping the backend to keep it alive"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        if response.status_code == 200:
            print(f"✅ Backend alive at {time.strftime('%H:%M:%S')}")
        else:
            print(f"⚠️  Backend returned {response.status_code}")
    except Exception as e:
        print(f"❌ Error pinging backend: {str(e)}")

def keep_alive():
    """Ping every 10 minutes"""
    schedule.every(10).minutes.do(ping_backend)
    
    print(f"🚀 Keep-alive service started")
    print(f"🎯 Target: {BACKEND_URL}")
    print(f"⏰ Pinging every 10 minutes")
    
    # Initial ping
    ping_backend()
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    keep_alive()
