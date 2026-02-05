from app.router.post import router as post_router
from app.router.auth import router as auth_router
from app.router.social_action import router as social_action_router

routers = [post_router, auth_router, social_action_router]
