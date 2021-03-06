"""empty message

Revision ID: 3839fb4f7d8f
Revises: df8b0d746557
Create Date: 2018-11-20 09:33:07.471639

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3839fb4f7d8f'
down_revision = 'df8b0d746557'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('node_user_id_fkey', 'node', type_='foreignkey')
    op.rename_table('node', 'business_poi')
    op.execute('ALTER SEQUENCE node_id_seq RENAME TO business_poi_id_seq ')
    op.execute('ALTER INDEX node_pkey RENAME TO business_poi_pkey')
    op.create_foreign_key(None, 'business_poi', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('business_poi_user_id_fkey', 'business_poi', type_='foreignkey')
    op.rename_table('business_poi', 'node')
    op.execute('ALTER SEQUENCE business_poi_id_seq RENAME TO node_id_seq')
    op.execute('ALTER INDEX business_poi_pkey RENAME TO node_pkey')
    op.create_foreign_key(None, 'node', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###
