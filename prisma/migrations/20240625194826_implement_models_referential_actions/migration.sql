-- DropForeignKey
ALTER TABLE "Carwash" DROP CONSTRAINT "Carwash_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "CarwashPackage" DROP CONSTRAINT "CarwashPackage_carwash_id_fkey";

-- DropForeignKey
ALTER TABLE "CarwashService" DROP CONSTRAINT "CarwashService_carwash_id_fkey";

-- DropForeignKey
ALTER TABLE "CarwashService" DROP CONSTRAINT "CarwashService_package_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- AddForeignKey
ALTER TABLE "CarwashPackage" ADD CONSTRAINT "CarwashPackage_carwash_id_fkey" FOREIGN KEY ("carwash_id") REFERENCES "Carwash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarwashService" ADD CONSTRAINT "CarwashService_carwash_id_fkey" FOREIGN KEY ("carwash_id") REFERENCES "Carwash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarwashService" ADD CONSTRAINT "CarwashService_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "CarwashPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carwash" ADD CONSTRAINT "Carwash_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
