import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const backupDir = path.join(process.cwd(), "backups");
    
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `database-backup-${timestamp}.db`;
    const sourcePath = path.join(process.cwd(), "prisma", "dev.db");
    const destPath = path.join(backupDir, backupFilename);

    await fs.copyFile(sourcePath, destPath);

    return NextResponse.json({ success: true, filename: backupFilename });
  } catch (error) {
    console.error("Backup generation failed:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (!file) {
    // Return list of backups
    try {
      const backupDir = path.join(process.cwd(), "backups");
      try {
        await fs.access(backupDir);
      } catch {
        return NextResponse.json({ files: [] });
      }

      const files = await fs.readdir(backupDir);
      const dbFiles = files.filter(f => f.endsWith('.db')).sort().reverse();
      
      const fileStats = await Promise.all(dbFiles.map(async f => {
        const stats = await fs.stat(path.join(backupDir, f));
        return {
          name: f,
          size: stats.size,
          createdAt: stats.birthtime
        };
      }));

      return NextResponse.json({ files: fileStats });
    } catch (err) {
      return NextResponse.json({ error: "Failed to read backups" }, { status: 500 });
    }
  }

  // Serve the file for download
  try {
    const safeFile = path.basename(file); // prevent path traversal
    const filePath = path.join(process.cwd(), "backups", safeFile);
    
    const fileBuffer = await fs.readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${safeFile}"`,
        "Content-Type": "application/octet-stream",
      }
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}
