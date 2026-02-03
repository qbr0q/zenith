from app.router.post import router as post_router
from app.router.account import router as account_router
from app.router.social_action import router as social_action_router

routers = [post_router, account_router, social_action_router]
