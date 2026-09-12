import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.character) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const items = await prisma.inventoryItem.findMany({
    where: { userId: user.id },
    include: { shopItem: true },
    orderBy: { acquiredAt: "desc" },
  });

  const character = user.character;
  const decorated = items.map((inv) => {
    let isEquipped = false;
    const category = inv.shopItem.category;
    const effectKey = inv.shopItem.effectKey;

    if (category === "THEME") isEquipped = character.equippedTheme === effectKey;
    else if (category === "AVATAR") isEquipped = character.equippedAvatar === effectKey;
    else if (category === "TITLE") isEquipped = character.equippedTitle === inv.shopItem.name;
    else if (category === "FRAME") isEquipped = character.equippedFrame === effectKey;

    return {
      id: inv.id,
      itemId: inv.shopItem.id,
      name: inv.shopItem.name,
      description: inv.shopItem.description,
      category: inv.shopItem.category,
      effectKey: inv.shopItem.effectKey,
      acquiredAt: inv.acquiredAt,
      isEquipped,
    };
  });

  return NextResponse.json({
    ok: true,
    data: decorated,
  });
}
