import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: {
        id: params.id,
      },
      include: {
        chapter: true,
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching resource" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { title, type, url, chapterId } = data;

    const resource = await prisma.resource.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        type,
        url,
        chapterId,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Error updating resource" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.resource.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting resource" }, { status: 500 });
  }
}
