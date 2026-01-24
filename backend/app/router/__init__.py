from .post_handler import router as post_router
from .account_handler import router as account_router
from .social_action_hanlder import router as social_action_router

routers = [post_router, account_router, social_action_router]
