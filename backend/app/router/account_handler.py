from fastapi import APIRouter, Depends, Response, HTTPException
from sqlmodel import Session

from app.database.utils import get_session
from app.database.models import User, UserInfo
from app.router.validate.response_shemas import AuthorSchema
from app.router.validate.request_schemas import LoginRequest, SignUpRequest
from app.router.validate.validate_form import validate_login, validate_signup
from .utils import get_user_by_main, create_token, set_token, get_user


router = APIRouter(prefix='/account', tags=["Account"])


@router.post('/login')
async def login(
    data: LoginRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    mail = data.mail
    password = data.password

    user = get_user_by_main(session, mail)

    err_code, err_detail = validate_login(user, mail, password)
    if err_code and err_detail:
        raise HTTPException(err_code, err_detail)

    token = create_token(user)
    set_token(response, token)

    return {
        'userId': user.id
    }


@router.post('/signup')
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

        user_info = UserInfo(user_id=user.id)
        session.add(user_info)
        session.commit()

        token = create_token(user)
        set_token(response, token)
    except Exception as e:
        session.rollback()
        raise HTTPException(500, str(e))

    return {
        'userId': user.id
    }


@router.get('/getUser/{user_id}', response_model=AuthorSchema)
async def get_user_post(
    user_id: int,
    session: Session = Depends(get_session)
):
    user = get_user(session, user_id)

    return user
