"""empty message

Revision ID: b87f822885cb
Revises: c59b310d5c92
Create Date: 2018-11-27 13:20:29.355030

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b87f822885cb'
down_revision = 'c59b310d5c92'
branch_labels = None
depends_on = None


def upgrade():
    op.execute('ALTER TABLE business_poi RENAME COLUMN osm_note_id to note_id')


def downgrade():
    op.execute('ALTER TABLE business_poi RENAME COLUMN note_id to osm_note_id')
