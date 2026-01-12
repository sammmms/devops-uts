import requests

def test_uncategorized():
    url = "http://localhost:8000/api/v1/todo"
    # First, list all to see what we have
    print("All todos:")
    all_todos = requests.get(url).json()
    print(all_todos)

    # Fetch uncategorized
    print("\nUncategorized todos (category_id=-1):")
    uncat = requests.get(url, params={"category_id": -1}).json()
    print(uncat)

    # Create a dummy uncategorized todo
    new_todo = {
        "name": "Test Uncategorized",
        "category_id": None
    }
    print("\nCreating uncategorized todo...")
    res = requests.post(url, json=new_todo)
    print(res.status_code, res.text)
    
    # Fetch again
    print("\nUncategorized todos after creation:")
    uncat_after = requests.get(url, params={"category_id": -1}).json()
    print(uncat_after)

if __name__ == "__main__":
    test_uncategorized()
