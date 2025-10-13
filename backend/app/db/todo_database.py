from app.db.base_database import BaseDatabase

class TodoDatabase(BaseDatabase):
    instance = None
    
    def __new__(cls):
        if not cls.instance:
            cls.instance = super(TodoDatabase, cls).__new__(cls)
            cls.instance._data = {}
        return cls.instance    
        