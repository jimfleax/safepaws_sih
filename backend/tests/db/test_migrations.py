import os
from pathlib import Path
from alembic.config import Config
from alembic.script import ScriptDirectory


def test_alembic_migration_graph_continuity():
    """Verify that Alembic migrations form a single continuous graph up to head b2f1a8e9c0d3."""
    backend_dir = Path(__file__).resolve().parent.parent.parent
    alembic_ini_path = backend_dir / "alembic.ini"
    
    config = Config(str(alembic_ini_path))
    script = ScriptDirectory.from_config(config)
    
    heads = script.get_heads()
    assert len(heads) == 1, f"Expected single head, got: {heads}"
    assert heads[0] == "b2f1a8e9c0d3", f"Expected head to be b2f1a8e9c0d3, got: {heads[0]}"

    # Verify parent of b2f1a8e9c0d3 is ae440fbabbfa
    latest_rev = script.get_revision("b2f1a8e9c0d3")
    assert latest_rev.down_revision == "ae440fbabbfa"


def test_migration_share_medical_notes_ddl_safe():
    """Verify that the migration defines safe non-null default false."""
    backend_dir = Path(__file__).resolve().parent.parent.parent
    migration_file = backend_dir / "alembic" / "versions" / "b2f1a8e9c0d3_add_share_medical_notes_to_pets.py"
    assert migration_file.exists(), "Migration file b2f1a8e9c0d3 must exist"
    
    content = migration_file.read_text()
    assert "share_medical_notes" in content
    assert "nullable=False" in content
    assert "server_default=sa.text('false')" in content
    assert "op.drop_column('pets', 'share_medical_notes')" in content
