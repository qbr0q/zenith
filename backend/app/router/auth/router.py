from fastapi import APIRouter, Depends, Response, \
    HTTPException, Request
from authx.exceptions import JWTDecodeError
from sqlalchemy.ext.asyncio import AsyncSession

from app.router.auth.shemas import LoginRequest, SignUpRequest
from app.database.utils import get_session
from app.router.deps import security
from app.router.auth.service import create_access_token, set_access_token
from .manager import AuthManager


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login(
    data: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    response_user = await AuthManager.login(
        session, response, data.mail, data.password
    )
    return response_user


@router.post("/signup")
async def sign_up(
    data: SignUpRequest,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    try:
        response_user = await AuthManager.sign_up(
            session, response, data.mail, data.password, data.username
        )
        return response_user
    except Exception as e:
        await session.rollback()
        raise HTTPException(500, str(e))


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
