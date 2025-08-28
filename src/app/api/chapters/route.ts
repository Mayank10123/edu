import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        resources: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching chapters" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, description, order } = data;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        description,
        order,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ error: "Error creating chapter" }, { status: 500 });
  }
}
