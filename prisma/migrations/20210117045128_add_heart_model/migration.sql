-- CreateTable
CREATE TABLE "Heart" (
"id" SERIAL,
    "fromID" TEXT NOT NULL,
    "toID" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Heart" ADD FOREIGN KEY("fromID")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heart" ADD FOREIGN KEY("toID")REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
