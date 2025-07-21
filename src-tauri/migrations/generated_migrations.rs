use tauri_plugin_sql::{Migration, MigrationKind};

pub fn load_migrations() -> Vec<Migration> {
    vec![
        Migration { version: 0, description: "0000_slow_scarecrow.sql", sql: include_str!("0000_slow_scarecrow.sql"), kind: MigrationKind::Up },
        Migration { version: 1, description: "0001_amusing_madame_web.sql", sql: include_str!("0001_amusing_madame_web.sql"), kind: MigrationKind::Up },
        Migration { version: 2, description: "0002_last_violations.sql", sql: include_str!("0002_last_violations.sql"), kind: MigrationKind::Up },
        Migration { version: 3, description: "0003_adorable_eternals.sql", sql: include_str!("0003_adorable_eternals.sql"), kind: MigrationKind::Up },
        Migration { version: 4, description: "0004_lyrical_rick_jones.sql", sql: include_str!("0004_lyrical_rick_jones.sql"), kind: MigrationKind::Up },
        Migration { version: 5, description: "0005_silent_bug.sql", sql: include_str!("0005_silent_bug.sql"), kind: MigrationKind::Up },
    ]
}
