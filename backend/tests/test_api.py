"""
Comprehensive test suite for all backend API routes using Local Mock Data Source.
Run with: python -m tests.test_api
"""

import os
import sys

# Set environment variable to use Local repositories (Mock)
os.environ["REPOSITORY_MODE"] = "local"

# Add backend directory to sys.path to allow imports
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from app.main import app
from app.datasources.local_datasource import LocalDataSource

# Create a single client instance that will be used throughout
client = TestClient(app)

# Test data
TEST_USER = {
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
}

TEST_CATEGORY = {
    "name": "Test Category"
}

TEST_TODO = {
    "name": "Test Todo",
    "description": "This is a test todo",
    "category_id": 1,
    "deadline": "2025-12-31"
}

# Store tokens and IDs for use in tests
auth_token = None
category_id = None
todo_id = None
user_id = None


def test_health_check():
    """Test health endpoint"""
    print("\n[1] Testing Health Check...")
    response = client.get("/api/v1/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("  ✓ Health check passed")


def test_auth_register():
    """Test user registration"""
    global user_id, auth_token
    print("\n[2] Testing User Registration...")
    response = client.post("/api/v1/auth/register", json=TEST_USER)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "data" in data
    assert "access_token" in data["data"]
    auth_token = data["data"]["access_token"]
    user_id = data["data"]["user"]["id"]
    print(f"  ✓ User registered successfully (ID: {user_id})")
    print(f"  ✓ Token obtained: {auth_token[:20]}...")


def test_auth_register_duplicate():
    """Test duplicate registration (should fail)"""
    print("\n[3] Testing Duplicate Registration...")
    response = client.post("/api/v1/auth/register", json=TEST_USER)
    # Depending on implementation, might return 400 or 409, code says 400 in previous auth_service
    assert response.status_code in [400, 409], f"Expected 400/409, got {response.status_code}"
    print("  ✓ Duplicate registration correctly rejected")


def test_auth_login():
    """Test user login"""
    global auth_token
    print("\n[4] Testing User Login...")
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "data" in data
    assert "access_token" in data["data"]
    auth_token = data["data"]["access_token"]
    print("  ✓ Login successful")


def test_auth_get_current_user():
    """Test getting current user info"""
    print("\n[5] Testing Get Current User...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "data" in data
    assert data["data"]["email"] == TEST_USER["email"]
    print(f"  ✓ Current user retrieved: {data['data']['username']}")


def test_category_create():
    """Test category creation"""
    global category_id
    print("\n[6] Testing Category Creation...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/v1/category", json=TEST_CATEGORY, headers=headers)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "category" in data
    category_id = data["category"]["id"]
    print(f"  ✓ Category created (ID: {category_id})")


def test_category_list():
    """Test listing categories"""
    print("\n[7] Testing List Categories...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/category", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "categories" in data
    print(f"  ✓ Categories retrieved: {len(data['categories'])} categories")


def test_category_get():
    """Test getting a specific category"""
    print("\n[8] Testing Get Category by ID...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get(f"/api/v1/category/{category_id}", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "category" in data
    print(f"  ✓ Category retrieved: {data['category']['name']}")


def test_category_update():
    """Test updating a category"""
    print("\n[9] Testing Update Category...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    update_data = {"name": "Updated Category"}
    response = client.put(f"/api/v1/category/{category_id}", json=update_data, headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    print("  ✓ Category updated")


def test_todo_create():
    """Test todo creation"""
    global todo_id
    print("\n[10] Testing Todo Creation...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    todo_data = {
        "name": "Test Todo",
        "description": "Test description",
        "category_id": category_id,
        "deadline": "2025-12-31"
    }
    response = client.post("/api/v1/todo", json=todo_data, headers=headers)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "todo" in data
    todo_id = data["todo"]["id"]
    print(f"  ✓ Todo created (ID: {todo_id})")


def test_todo_list():
    """Test listing todos"""
    print("\n[11] Testing List Todos...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/todo", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "todos" in data
    print(f"  ✓ Todos retrieved: {len(data['todos'])} todos")


def test_todo_list_with_filter():
    """Test listing todos with category filter"""
    print("\n[12] Testing List Todos with Category Filter...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get(f"/api/v1/todo?category_id={category_id}", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "todos" in data
    print(f"  ✓ Filtered todos retrieved: {len(data['todos'])} todos")


def test_todo_get():
    """Test getting a specific todo"""
    print("\n[13] Testing Get Todo by ID...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get(f"/api/v1/todo/{todo_id}", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "todo" in data
    print(f"  ✓ Todo retrieved: {data['todo']['name']}")


def test_todo_update():
    """Test updating a todo"""
    print("\n[14] Testing Update Todo...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    update_data = {
        "name": "Updated Todo",
        "description": "Updated description",
        "category_id": category_id,
        "deadline": "2025-12-31",
        "completed": True
    }
    response = client.put(f"/api/v1/todo/{todo_id}", json=update_data, headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    print("  ✓ Todo updated")


def test_dashboard_stats():
    """Test getting dashboard statistics"""
    print("\n[15] Testing Dashboard Stats...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/dashboard/stats", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "data" in data
    stats = data["data"]
    print(f"  ✓ Dashboard stats retrieved:")
    print(f"    - Total Todos: {stats.get('total_todos', 0)}")
    print(f"    - Completed: {stats.get('completed_todos', 0)}")
    print(f"    - Pending: {stats.get('pending_todos', 0)}")
    print(f"    - Categories: {stats.get('total_categories', 0)}")


def test_category_todo_list():
    """Test getting todos by category"""
    print("\n[16] Testing Get Todos by Category...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post(f"/api/v1/category-todos/{category_id}/todo", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "todos" in data
    print(f"  ✓ Category todos retrieved: {len(data['todos'])} todos")


def test_todo_delete():
    """Test deleting a todo"""
    print("\n[17] Testing Delete Todo...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.delete(f"/api/v1/todo/{todo_id}", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    print("  ✓ Todo deleted")


def test_category_delete():
    """Test deleting a category"""
    print("\n[18] Testing Delete Category...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.delete(f"/api/v1/category/{category_id}", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    print("  ✓ Category deleted")


def test_auth_refresh():
    """Test token refresh"""
    print("\n[19] Testing Token Refresh...")
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/v1/auth/refresh", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    data = response.json()
    assert "data" in data
    assert "access_token" in data["data"]
    print("  ✓ Token refreshed successfully")


def test_invalid_token():
    """Test with invalid token"""
    print("\n[20] Testing Invalid Token...")
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/v1/category", headers=headers)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("  ✓ Invalid token correctly rejected")


def test_missing_auth():
    """Test missing authentication"""
    print("\n[21] Testing Missing Authentication...")
    response = client.get("/api/v1/category")
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"
    print("  ✓ Missing auth correctly rejected")


if __name__ == "__main__":
    print("=" * 60)
    print("BACKEND API ROUTE TESTS (with Local Mock DataSource)")
    print("=" * 60)
    
    try:
        # Reset Mock DataSource
        ds = LocalDataSource()
        ds.users.clear()
        ds.todos.clear()
        ds.categories.clear()

        # Run all tests
        test_health_check()
        test_auth_register()
        test_auth_register_duplicate()
        test_auth_login()
        test_auth_get_current_user()
        
        test_category_create()
        test_category_list()
        test_category_get()
        test_category_update()
        
        test_todo_create()
        test_todo_list()
        test_todo_list_with_filter()
        test_todo_get()
        test_todo_update()
        
        test_dashboard_stats()
        
        test_category_todo_list()
        
        test_todo_delete()
        test_category_delete()
        
        test_auth_refresh()
        test_invalid_token()
        test_missing_auth()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
