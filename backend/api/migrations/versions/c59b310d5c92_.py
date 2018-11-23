"""empty message

Revision ID: c59b310d5c92
Revises: 3839fb4f7d8f
Create Date: 2018-11-20 14:01:35.235598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c59b310d5c92'
down_revision = '3839fb4f7d8f'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('business_poi', sa.Column('osm_type', sa.String(8)))
    # Before upgrading the database only stores nodes.
    op.execute(f"""
        UPDATE "business_poi"
        SET osm_type = 'node'
    """)


def downgrade():
    op.drop_column('business_poi', 'osm_type')

