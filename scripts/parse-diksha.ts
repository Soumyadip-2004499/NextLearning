import fs from "fs";
import path from "path";
import readline from "readline";

interface DikshaRow {
  contentName: string;
  board: string;
  medium: string;
  subject: string;
  mimeType: string;
  objectId: string;
  totalInteractions: number;
  totalTimespent: number;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  const csvPath = path.join(process.cwd(), "data", "diksha-dataset.csv");
  const stream = fs.createReadStream(csvPath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineCount = 0;
  const subjectsMap: Record<string, number> = {};
  const validRows: DikshaRow[] = [];

  for await (const line of rl) {
    lineCount++;
    if (lineCount === 1) continue; // Skip header

    const cols = parseCsvLine(line);
    // Header columns:
    // 0: Date, 1: dimensions_pdata_id, 2: dimensions_type, 3: dimensions_mode
    // 4: content_name, 5: content_board, 6: content_medium, 7: content_subject
    // 8: content_mimetype, 9: object_id, 10: object_type, 11: object_rollup_l1
    // 12: collection_name, 13: collection_board, 14: collection_type, 15: collection_medium
    // 16: collection_subject, 17: total_interactions, 18: total_timespent_in_seconds, 19: total_count

    if (cols.length >= 10) {
      const contentName = cols[4]?.replace(/^['"]|['"]$/g, "");
      const board = cols[5]?.replace(/^['"]|['"]$/g, "");
      const medium = cols[6]?.replace(/^['"]|['"]$/g, "");
      const subject = cols[7]?.replace(/^['"]|['"]$/g, "");
      const mimeType = cols[8]?.replace(/^['"]|['"]$/g, "");
      const objectId = cols[9]?.replace(/^['"]|['"]$/g, "");
      const interactions = parseInt(cols[17] || "0", 10) || 0;
      const timespent = parseFloat(cols[18] || "0") || 0;

      if (
        contentName &&
        contentName !== "unknown" &&
        contentName !== "Unknown" &&
        contentName.length > 3
      ) {
        subjectsMap[subject] = (subjectsMap[subject] || 0) + 1;
        if (interactions > 0 || timespent > 0) {
          validRows.push({
            contentName,
            board,
            medium,
            subject,
            mimeType,
            objectId,
            totalInteractions: interactions,
            totalTimespent: timespent,
          });
        }
      }
    }
  }

  console.log(`Processed ${lineCount} total lines.`);
  console.log(`Found ${validRows.length} active DIKSHA educational resources with interactions.`);
  console.log("Top Subjects in DIKSHA Dataset:");
  const sortedSubjects = Object.entries(subjectsMap).sort((a, b) => b[1] - a[1]);
  console.log(sortedSubjects.slice(0, 20));

  console.log("\nSample high-engagement DIKSHA resources:");
  validRows
    .sort((a, b) => b.totalTimespent - a.totalTimespent)
    .slice(0, 10)
    .forEach((row, i) => {
      console.log(
        `${i + 1}. [${row.subject}] ${row.contentName} (${row.medium}, ${row.board}) - ID: ${row.objectId}`
      );
    });
}

main().catch(console.error);
