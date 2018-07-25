"""empty message

Revision ID: 71e497c1037f
Revises: 886b7f97162a
Create Date: 2018-07-25 06:32:36.099910

"""

# revision identifiers, used by Alembic.
revision = '71e497c1037f'
down_revision = '886b7f97162a'

from alembic import op
import sqlalchemy as sa


def upgrade():
    word_table = sa.Table('word', sa.MetaData(bind=op.get_bind()), autoload=True)
    op.get_bind().execute(
        word_table.update().values(is_name=False, is_toponym=False)
    )

    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('word', 'is_name',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    op.alter_column('word', 'is_toponym',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('word', 'is_toponym',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    op.alter_column('word', 'is_name',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    # ### end Alembic commands ###