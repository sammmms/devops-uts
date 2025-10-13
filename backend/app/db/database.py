from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def get(self, key):
        pass
    
    @abstractmethod
    def append(self, value):
        pass
    
    @abstractmethod
    def insert(self, key, value):
        pass
    
    @abstractmethod
    def update(self, key, value):
        pass
    
    @abstractmethod
    def delete(self, key):
        pass
    
    @abstractmethod
    def all(self):
        pass