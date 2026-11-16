import { validateSnapshot } from "./snapshotValidation";
const { report, files } = validateSnapshot(process.argv[2] ?? "public");
console.log(JSON.stringify({ status: "valid", asOf: new Date(report.asOf * 1000).toISOString(), files, traders: report.scopes[0].windows.all.totalWallets }));
