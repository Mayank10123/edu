import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        chapter: true,
      },
    });
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, type, url, chapterId } = data;

    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        url,
        chapterId,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Error creating resource" }, { status: 500 });
  }
}
