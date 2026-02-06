from app.database.models import CommentImage
from app.router.utils import _handle_upload
from settings import comment_content_folder


async def attach_comment_images(session, files, author_id, comment_id):
    data = await _handle_upload(files, author_id,
                                comment_content_folder, comment_id=comment_id)
    new_image = [CommentImage(**item) for item in data]
    session.add_all(new_image)
