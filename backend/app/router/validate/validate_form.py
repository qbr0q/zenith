def validate_login(user, mail, password):
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


def validate_signup(mail, password, username):
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
