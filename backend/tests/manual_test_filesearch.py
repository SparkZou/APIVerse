import requests
import sys

BASE_URL = "http://localhost:8000"

def test_flow():
    # 1. Register User
    email = "test_user_flow@example.com"
    password = "password123"
    print(f"1. Registering user {email}...")
    resp = requests.post(f"{BASE_URL}/users/", json={
        "email": email,
        "password": password,
        "company_name": "Test Co"
    })
    if resp.status_code == 400 and "already registered" in resp.text:
        print("   User already exists, proceeding to login.")
    elif resp.status_code != 200:
        print(f"   Failed to register: {resp.text}")
        return
    else:
        print("   User registered.")

    # 2. Login
    print("2. Logging in...")
    resp = requests.post(f"{BASE_URL}/users/login", json={
        "email": email,
        "password": password
    })
    if resp.status_code != 200:
        print(f"   Login failed: {resp.text}")
        return
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   Login successful.")

    # 3. Create Knowledge Base
    print("3. Creating Knowledge Base...")
    kb_name = "Test Knowledge Base"
    resp = requests.post(f"{BASE_URL}/api/file-search/knowledge-bases", json={
        "name": kb_name,
        "description": "Integration test KB"
    }, headers=headers)
    if resp.status_code != 200:
        print(f"   Failed to create KB: {resp.text}")
        return
    kb = resp.json()
    kb_id = kb["id"]
    print(f"   KB Created: ID {kb_id}")

    # 4. Upload Document
    print("4. Uploading Document...")
    # Create a dummy file
    with open("test_doc.txt", "w") as f:
        f.write("Google File Search is a powerful tool for retrieving document information. APIVerse integrates this.")
    
    with open("test_doc.txt", "rb") as f:
        files = {'file': ("test_doc.txt", f, "text/plain")}
        resp = requests.post(f"{BASE_URL}/api/file-search/knowledge-bases/{kb_id}/documents", headers=headers, files=files)
    
    if resp.status_code != 200:
        print(f"   Failed to upload document: {resp.text}")
        return
    doc = resp.json()
    print(f"   Document uploaded: {doc['filename']} (Status: {doc['status']})")

    # 5. Search
    print("5. Searching...")
    import time
    time.sleep(2) # Give a moment for processing if async (Gemini is fast usually)
    
    query = "What is APIVerse?"
    resp = requests.post(f"{BASE_URL}/api/file-search/query", headers=headers, json={
        "knowledge_base_id": kb_id,
        "query": query
    })
    
    if resp.status_code != 200:
        print(f"   Search failed: {resp.text}")
        return
    
    result = resp.json()
    print("   Search Results:")
    print(result)

    # 6. Check Quota
    print("6. Checking Quota...")
    resp = requests.get(f"{BASE_URL}/api/file-search/quota", headers=headers)
    print(resp.json())

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"Test failed with exception: {e}")
