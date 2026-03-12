-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'ACCOUNT',
    "recurrence" TEXT NOT NULL DEFAULT 'NONE',
    "nextDue" DATETIME,
    "userId" TEXT NOT NULL,
    "budgetId" TEXT,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "budgetId", "category", "date", "description", "id", "source", "type", "userId") SELECT "amount", "budgetId", "category", "date", "description", "id", "source", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX "Transaction_source_idx" ON "Transaction"("source");
CREATE INDEX "Transaction_budgetId_idx" ON "Transaction"("budgetId");
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
