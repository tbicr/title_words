"""empty message

Revision ID: 886b7f97162a
Revises: 831ed5b0257c
Create Date: 2018-07-25 06:31:57.253173

"""

# revision identifiers, used by Alembic.
revision = '886b7f97162a'
down_revision = '831ed5b0257c'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('word', sa.Column('is_name', sa.Boolean(), nullable=True))
    op.add_column('word', sa.Column('is_toponym', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('word', 'is_toponym')
    op.drop_column('word', 'is_name')
    # ### end Alembic commands ###