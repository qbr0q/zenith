from fastapi import HTTPException

from app.router.auth.service import find_user, create_access_token, \
    create_refresh_token, set_access_token, set_refresh_token, get_response_user
from app.database.models.auth import User, UserInfo


class AuthManager:
    @classmethod
    async def login(cls, session, response, mail, password):

        user = await find_user(session, mail)

        err_code, err_detail = ValidateManager.validate_login(
            user, mail, password)

        if err_code and err_detail:
            raise HTTPException(err_code, err_detail)

        user_id = user.id
        access_token = create_access_token(user_id)
        refresh_token = create_refresh_token(user_id)

        set_access_token(response, access_token)
        set_refresh_token(response, refresh_token)

        response_user = get_response_user(user, access_token)

        return response_user

    @classmethod
    async def sign_up(cls, session, response, mail, password, username):
        err_code, err_detail = ValidateManager.validate_signup(
            mail, password, username
        )
        if err_code and err_detail:
            raise HTTPException(err_code, err_detail)

        user = User(
            mail=mail,
            username=username,
            password=password,
            info=UserInfo()
        )
        session.add(user)
        await session.flush()

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        set_access_token(response, access_token)
        set_refresh_token(response, refresh_token)
        await session.commit()

        response_user = get_response_user(user, access_token)

        return response_user


class ValidateManager:
    @classmethod
    def validate_login(cls, user, mail, password):
        err_code = 0
        err_detail = ''

        if not mail:
            err_code = 400
            err_detail = 'Пустой логин'

        elif not password:
            err_code = 400
            err_detail = 'Пустой пароль'

        elif not user:
            err_code = 401
            err_detail = 'Неверный адрес почты'

        elif user.password != password:
            err_code = 401
            err_detail = 'Неверный пароль'

        return err_code, err_detail

    @classmethod
    def validate_signup(cls, mail, password, username):
        err_code = 0
        err_detail = ''

        if not mail:
            err_code = 400
            err_detail = 'Пустой адрес почты'

        elif not password:
            err_code = 400
            err_detail = 'Пустой пароль'

        elif not username:
            err_code = 400
            err_detail = 'Пустой юзернейм'

        elif '@' not in mail:
            err_code = 400
            err_detail = 'Некорректный адрес почты'

        return err_code, err_detail
