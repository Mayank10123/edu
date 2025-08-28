import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.id,
      },
      include: {
        resources: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching chapter" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { title, description, order } = data;

    const chapter = await prisma.chapter.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        order,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ error: "Error updating chapter" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.chapter.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting chapter" }, { status: 500 });
  }
}
