from fastapi import Request, HTTPException

from settings import security


async def get_current_user_id(request: Request):
    token_name = security.config.JWT_ACCESS_COOKIE_NAME
    token = request.cookies.get(token_name)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Пользователь не авторизован"
        )

    try:
        access_token = await security.get_access_token_from_request(
            request
        )
        payload = security.verify_token(access_token, verify_csrf=False)
        return payload.sub
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Токен не валиден: {str(e)}"
        )
