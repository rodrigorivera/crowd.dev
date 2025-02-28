from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Table
from .base import Base
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import JSONB, UUID
from crowd.backend.models.user import User

association_noMerge_table = Table(
    "communityMemberNoMerge",
    Base.metadata,
    Column("communityMemberId", UUID(as_uuid=True), ForeignKey("communityMembers.id"), primary_key=True),
)

association_toMerge_table = Table(
    "communityMemberToMerge",
    Base.metadata,
    Column("communityMemberId", UUID(as_uuid=True), ForeignKey("communityMembers.id"), primary_key=True),
)


class CommunityMember(Base):
    """
    CommunityMember model

    Args:
        Base (Base): Parent class
    """

    __tablename__ = "communityMembers"  # Table name in database

    id = Column(String, primary_key=True)
    username = Column(JSONB, nullable=False)
    type = Column(String, nullable=False, default="member")
    info = Column(JSONB, default={})
    crowdInfo = Column(JSONB, default={})
    email = Column(String)
    score = Column(Integer, default=-1)
    bio = Column(String)
    organisation = Column(String)
    location = Column(String)
    signals = Column(String)
    joinedAt = Column(DateTime, nullable=False)
    importHash = Column(String, nullable=True)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)
    deletedAt = Column(DateTime)

    tenantId = Column(String, ForeignKey("tenants.id"), nullable=False)
    parentTenant = relationship("Tenant", back_populates="communityMembers")

    createdById = Column(String, ForeignKey("users.id"))
    updatedById = Column(String, ForeignKey("users.id"))

    parentUser = relationship("User", foreign_keys=[createdById])
    updateParentUser = relationship("User", foreign_keys=[updatedById])

    # relationships
    activities = relationship("Activity", back_populates="parentCommunityMember", lazy="dynamic")

    noMerge = relationship("CommunityMember", secondary=association_noMerge_table, back_populates="noMerge")

    toMerge = relationship("CommunityMember", secondary=association_toMerge_table, back_populates="toMerge")

    # validation
    @validates("username")
    def validate_username(self, key, value):
        assert value != ""
        return value

    @validates("type")
    def validate_type(self, key, value):
        assert value != ""
        assert value == "member"
        return value

    @validates("joinedAt")
    def validate_joinedAt(self, key, value):
        assert value != ""
        return value

    @validates("importHash")
    def validate_importHash(self, key, value):
        if value is not None:
            assert len(value) <= 255
        return value
