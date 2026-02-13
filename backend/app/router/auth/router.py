from fastapi import APIRouter, Depends, Response, \
    HTTPException, Request
from sqlmodel import Session
from authx.exceptions import JWTDecodeError

from app.database.utils import get_session
from app.database.models import User, UserInfo
from app.router.validate.request_schemas import LoginRequest, SignUpRequest
from app.router.validate.validate_form import validate_login, validate_signup
from app.router.auth.utils import find_user, create_access_token, \
    create_refresh_token, set_access_token, set_refresh_token, get_response_user
from settings import security


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login(
    data: LoginRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    mail = data.mail
    password = data.password

    user = find_user(session, mail)

    err_code, err_detail = validate_login(user, mail, password)
    if err_code and err_detail:
        raise HTTPException(err_code, err_detail)

    user_id = user.id
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    set_access_token(response, access_token)
    set_refresh_token(response, refresh_token)

    response_user = get_response_user(user)

    return response_user


@router.post("/signup")
def sign_up(
    data: SignUpRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    mail = data.mail
    password = data.password
    username = data.username

    err_code, err_detail = validate_signup(mail, password, username)
    if err_code and err_detail:
        raise HTTPException(err_code, err_detail)

    try:
        user = User(mail=data.mail, username=data.username, password=data.password)
        session.add(user)
        session.flush()
        user_id = user.id

        user_info = UserInfo(user_id=user_id)
        session.add(user_info)
        session.commit()

        access_token = create_access_token(user_id)
        refresh_token = create_refresh_token(user_id)

        set_access_token(response, access_token)
        set_refresh_token(response, refresh_token)
    except Exception as e:
        session.rollback()
        raise HTTPException(500, str(e))

    response_user = get_response_user(user)

    return response_user


@router.post("/refresh_token")
async def refresh_token(request: Request, response: Response):
    token_name = security.config.JWT_REFRESH_COOKIE_NAME
    token = request.cookies.get(token_name)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Отсутствует refresh токен"
        )

    try:
        refresh_token = await security.get_refresh_token_from_request(
            request
        )
        payload = security.verify_token(refresh_token, verify_csrf=False)

        access_token = create_access_token(payload.sub)
        set_access_token(response, access_token)
    except JWTDecodeError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Refresh токен не валиден: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
