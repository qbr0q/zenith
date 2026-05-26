import requests

from app.core import settings


class CommunityBot:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self._session = None
        self._base_url = None

    @property
    def base_url(self):
        if not self._base_url:
            base_url = f"http://{settings.server.host}:{settings.server.port}/api"
            self._base_url = base_url
        return self._base_url

    @property
    def session(self):
        if not self._session:
            session = self.get_session()
            self._session = session
        return self._session

    @staticmethod
    def get_session():
        session = requests.Session()
        session.trust_env = False
        return session

    def login(self):
        payload = {"mail": self.username, "password": self.password}
        url = f"{self.base_url}/auth/login"
        self.session.post(url, json=payload)

    def create_post(self, data):
        files = []
        url = f"{self.base_url}/posts/"
        self.session.post(url, data=data, files=files)

    def create_comment(self, data):
        files = []
        url = f"{self.base_url}/social_action/create_comment"
        self.session.post(url, data=data, files=files)

    def get_last_posts(self):
        url = f"{BASE_API}/posts/"
        response = self.session.get(url)
        posts = response.json()
        return posts[:5]
