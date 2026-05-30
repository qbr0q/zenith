from app.router.post import router as post_router
from app.router.auth import router as auth_router
from app.router.comment import router as comment_router
from app.router.like import router as like_router


routers = [post_router, auth_router, comment_router, like_router]
