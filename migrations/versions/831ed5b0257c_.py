"""empty message

Revision ID: 831ed5b0257c
Revises: None
Create Date: 2016-11-06 19:52:13.271026

"""

# revision identifiers, used by Alembic.
revision = '831ed5b0257c'
down_revision = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('email', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('title',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=32), nullable=False),
    sa.Column('total_words_count', sa.Integer(), nullable=False),
    sa.Column('unique_words_count', sa.Integer(), nullable=False),
    sa.Column('date_added', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('word',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('word', sa.String(length=32), nullable=False),
    sa.Column('times', sa.Integer(), nullable=False),
    sa.Column('known', sa.Boolean(), nullable=False),
    sa.Column('date_added', sa.DateTime(), nullable=False),
    sa.Column('date_known', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'word'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('title_word',
    sa.Column('title_id', sa.Integer(), nullable=False),
    sa.Column('word_id', sa.Integer(), nullable=False),
    sa.Column('times', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['title_id'], ['title.id'], ),
    sa.ForeignKeyConstraint(['word_id'], ['word.id'], ),
    sa.PrimaryKeyConstraint('title_id', 'word_id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('title_word')
    op.drop_table('word')
    op.drop_table('title')
    op.drop_table('user')
    ### end Alembic commands ###
