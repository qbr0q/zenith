from fastapi import APIRouter, Depends, Response, HTTPException
from sqlmodel import Session

from app.database.utils import get_session
from app.database.models import User
from app.router.validate.response_shemas import LoginPost, SignUpPost, UserRead
from app.router.validate.validate_form import validate_login, validate_signup
from .utils import get_user_by_main, create_token, set_token, get_user


router = APIRouter(prefix='/account', tags=["Account"])


@router.post('/login')
async def login(
    data: LoginPost,
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
        'status': 'success',
        'userId': user.id
    }


@router.post('/signup')
def sign_up(
    data: SignUpPost,
    response: Response,
    session: Session = Depends(get_session)
):
    mail = data.mail
    password = data.password
    username = data.username

    err_code, err_detail = validate_signup(mail, password, username)
    if err_code and err_detail:
        raise HTTPException(err_code, err_detail)

    user = User(mail=data.mail, username=data.username, password=data.password)
    token = create_token(user)

    set_token(response, token)
    session.add(user)
    session.commit()

    return {
        'status': 'success',
        'userId': user.id
    }


@router.get('/getUser/{user_id}', response_model=UserRead)
async def get_user_post(
    user_id: int,
    session: Session = Depends(get_session)
):
    user = get_user(session, user_id)

    return user
