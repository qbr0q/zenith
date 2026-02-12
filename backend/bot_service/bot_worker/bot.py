import requests
import json

from settings import BASE_API


class CommunityBot:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.session = self.get_session()
        self.base_url = BASE_API

    @staticmethod
    def get_session():
        session = requests.Session()
        session.trust_env = False
        return session

    def login(self):
        payload = {"mail": self.username, "password": self.password}
        url = f"{self.base_url}/auth/login"
        self.session.post(url, json=payload)

    def create_post(self, text):
        data = {"text": text}
        files = []
        url = f"{self.base_url}/posts/"
        self.session.post(url, data=data, files=files)
