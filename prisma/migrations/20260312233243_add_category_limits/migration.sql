-- CreateTable
CREATE TABLE "CategoryLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "monthlyLimit" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CategoryLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CategoryLimit_userId_idx" ON "CategoryLimit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLimit_userId_category_key" ON "CategoryLimit"("userId", "category");
