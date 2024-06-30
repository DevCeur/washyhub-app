-- CreateTable
CREATE TABLE "CarwashPackage" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cost" DECIMAL(65,30) NOT NULL,
    "carwash_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarwashPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarwashService" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cost" DECIMAL(65,30) NOT NULL,
    "carwash_id" TEXT NOT NULL,
    "package_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarwashService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarwashPackage" ADD CONSTRAINT "CarwashPackage_carwash_id_fkey" FOREIGN KEY ("carwash_id") REFERENCES "Carwash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarwashService" ADD CONSTRAINT "CarwashService_carwash_id_fkey" FOREIGN KEY ("carwash_id") REFERENCES "Carwash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarwashService" ADD CONSTRAINT "CarwashService_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "CarwashPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
