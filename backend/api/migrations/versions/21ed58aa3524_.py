"""empty message

Revision ID: 21ed58aa3524
Revises: 5b39e615ff01
Create Date: 2018-10-19 08:24:42.833462

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '21ed58aa3524'
down_revision = '5b39e615ff01'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('node', sa.Column('map_note_id', sa.BigInteger(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('node', 'map_note_id')
    # ### end Alembic commands ###
