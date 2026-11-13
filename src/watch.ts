import { spawn } from "node:child_process";
const value =
  process.argv.find((a) => a.startsWith("--minutes="))?.slice(10) ?? "60";
const minutes = Number(value);
if (!Number.isFinite(minutes) || minutes < 5)
  throw new Error("Use an interval of at least 5 minutes");
let stopping = false;
let child: ReturnType<typeof spawn> | null = null;
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => {
    stopping = true;
    child?.kill(signal);
  });
while (!stopping) {
  const started = Date.now();
  console.log(`Starting incremental scan at ${new Date().toISOString()}`);
  await new Promise<void>((resolve) => {
    child = spawn(
      process.execPath,
      ["--env-file-if-exists=.env", "--import", "tsx", "src/cli.ts"],
      { stdio: "inherit", cwd: process.cwd() },
    );
    child.once("error", (e) => {
      console.error(e.message);
      resolve();
    });
    child.once("exit", (code) => {
      if (code)
        console.error(
          `Scan exited ${code}; last committed cursor will be reused`,
        );
      resolve();
    });
  });
  child = null;
  if (stopping) break;
  const next = Math.max(0, minutes * 60000 - (Date.now() - started));
  console.log(`Next scan in ${Math.ceil(next / 60000)} minutes`);
  // Short waits make shutdown responsive without overlapping scans.
  for (let remaining = next; remaining > 0 && !stopping; remaining -= 1000)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(1000, remaining)),
    );
}
