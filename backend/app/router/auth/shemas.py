from pydantic import BaseModel


class LoginRequest(BaseModel):
    mail: str
    password: str


class SignUpRequest(BaseModel):
    mail: str
    username: str
    password: str
