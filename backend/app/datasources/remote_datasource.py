from app.datasources.session import SessionLocal

class RemoteDataSource:
    def get_session(self):
        return SessionLocal()
