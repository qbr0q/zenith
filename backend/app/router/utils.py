import os
import uuid
import shutil
from fastapi import Request, HTTPException
from authx.exceptions import JWTDecodeError

from settings import security


async def get_current_user_id(request: Request):
    token_name = security.config.JWT_ACCESS_COOKIE_NAME
    token = request.cookies.get(token_name)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="AUTH_REQUIRED"
        )

    try:
        access_token = await security.get_access_token_from_request(
            request
        )
        payload = security.verify_token(access_token, verify_csrf=False)
        return payload.sub
    except JWTDecodeError:
        raise HTTPException(
            status_code=401,
            detail="TOKEN_EXPIRED"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


async def save_image(upload_file, media_folder) -> str:
    extension = os.path.splitext(upload_file.filename)[1].lower()
    unique_name = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(media_folder, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return unique_name


async def _handle_upload(files, author_id, media_folder, **extra_fields):
    results = []
    if files:
        for file in files:
            url = await save_image(file, media_folder)
            results.append({"image_path": url, "author_id": author_id, **extra_fields})
    return results
