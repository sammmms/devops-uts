from fastapi.responses import JSONResponse


from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse


def create_json_response(message: str, data: dict = None, status_code: int = 200):
    encoded = jsonable_encoder({"message": message, **(data or {})})
    return JSONResponse(content=encoded, status_code=status_code)
