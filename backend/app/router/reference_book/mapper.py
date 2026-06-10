from .enums import ReferenceBookName
from app.database.models.rb import RbTopic


rb_mapping = {
    ReferenceBookName.rb_topic: RbTopic
}
