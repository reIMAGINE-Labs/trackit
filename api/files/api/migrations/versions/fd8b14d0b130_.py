"""empty message

Revision ID: fd8b14d0b130
Revises: 83bed86e1cba
Create Date: 2016-10-06 18:24:34.713047

"""

# revision identifiers, used by Alembic.
revision = 'fd8b14d0b130'
down_revision = '83bed86e1cba'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('aws_key', sa.Column('import_s3', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('aws_key', 'import_s3')
    ### end Alembic commands ###
