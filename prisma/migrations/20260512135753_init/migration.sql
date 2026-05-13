-- CreateTable
CREATE TABLE "addon_overrides" (
    "cloudbeds_item_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addon_overrides_pkey" PRIMARY KEY ("cloudbeds_item_id")
);
