class LocalDataSource:
    _instance = None
    
    users: dict = {}
    todos: dict = {}
    categories: dict = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LocalDataSource, cls).__new__(cls)
            cls._instance.users = {}
            cls._instance.todos = {}
            cls._instance.categories = {}
        return cls._instance
