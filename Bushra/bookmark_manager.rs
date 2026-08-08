use rusqlite::{Connection, Result};
use std::env;

fn main() -> Result<()> {
    let conn = Connection::open("bookmarks.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS bookmarks (
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url   TEXT NOT NULL
        )",
        (),
    )?;

    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("Usage:");
        println!("  add <title> <url>");
        println!("  view");
        println!("  search <keyword>");
        println!("  delete <id>");
        return Ok(());
    }

    let command = args[1].as_str();

    match command {
        "add" => {
            if args.len() < 4 {
                println!("Usage: add <title> <url>");
                return Ok(());
            }
            let title = &args[2];
            let url = &args[3];
            conn.execute(
                "INSERT INTO bookmarks (title, url) VALUES (?1, ?2)",
                (title, url),
            )?;
            println!("Bookmark added: {} -> {}", title, url);
        }
        "view" => {
            let mut stmt = conn.prepare("SELECT id, title, url FROM bookmarks")?;
            let rows = stmt.query_map((), |row| {
                Ok((
                    row.get::<_, i32>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                ))
            })?;

            for row in rows {
                let (id, title, url) = row?;
                println!("[{}] {} -> {}", id, title, url);
            }
        }
        "search" => {
            if args.len() < 3 {
                println!("Usage: search <keyword>");
                return Ok(());
            }
            let keyword = format!("%{}%", args[2]);
            let mut stmt = conn.prepare(
                "SELECT id, title, url FROM bookmarks WHERE title LIKE ?1",
            )?;
            let rows = stmt.query_map([keyword], |row| {
                Ok((
                    row.get::<_, i32>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                ))
            })?;

            for row in rows {
                let (id, title, url) = row?;
                println!("[{}] {} -> {}", id, title, url);
            }
        }
        "delete" => {
            if args.len() < 3 {
                println!("Usage: delete <id>");
                return Ok(());
            }
            let id: i32 = args[2].parse().unwrap_or(-1);
            let changed = conn.execute("DELETE FROM bookmarks WHERE id = ?1", [id])?;
            if changed > 0 {
                println!("Deleted bookmark with id {}", id);
            } else {
                println!("No bookmark found with id {}", id);
            }
        }
        _ => {
            println!("Unknown command: {}", command);
        }
    }

    Ok(())
          }
