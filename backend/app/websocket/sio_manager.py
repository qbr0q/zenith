import socketio


sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')


def run_socket(app):
    sio_app = socketio.ASGIApp(sio, socketio_path='')
    app.mount("/ws", sio_app)


@sio.on('connect')
async def connect(sid, environ):
    print(f"Подключился: {sid}")
