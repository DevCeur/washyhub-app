/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_owner_id_fkey";

-- DropTable
DROP TABLE "Organization";

-- CreateTable
CREATE TABLE "Carwash" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "owner_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carwash_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Carwash" ADD CONSTRAINT "Carwash_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
