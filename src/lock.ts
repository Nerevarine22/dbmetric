import fs from "node:fs";
import path from "node:path";
export function acquireWriterLock(directory = "data") {
  fs.mkdirSync(directory, { recursive: true });
  const file = path.resolve(directory, "indexer.lock");
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = fs.openSync(file, "wx");
      fs.writeSync(
        fd,
        JSON.stringify({
          pid: process.pid,
          startedAt: new Date().toISOString(),
        }),
      );
      fs.closeSync(fd);
      const release = () => {
        try {
          const lock = JSON.parse(fs.readFileSync(file, "utf8"));
          if (lock.pid === process.pid) fs.unlinkSync(file);
        } catch {}
      };
      process.once("exit", release);
      return release;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
      let pid: number;
      try {
        pid = JSON.parse(fs.readFileSync(file, "utf8")).pid;
      } catch {
        throw new Error(
          "Invalid indexer lock; inspect data/indexer.lock before removing it",
        );
      }
      let alive = true;
      try {
        process.kill(pid, 0);
      } catch (error) {
        alive = (error as NodeJS.ErrnoException).code !== "ESRCH";
      }
      if (alive)
        throw new Error(
          `Indexer PID ${pid} is already running. Wait for it before starting another scan.`,
        );
      fs.unlinkSync(file);
    }
  }
  throw new Error("Could not acquire indexer lock");
}
