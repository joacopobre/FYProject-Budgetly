-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "target" REAL,
    "rollover" BOOLEAN NOT NULL DEFAULT false,
    "lastResetAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Budget" ("balance", "createdAt", "id", "kind", "name", "target", "userId") SELECT "balance", "createdAt", "id", "kind", "name", "target", "userId" FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
CREATE INDEX "Budget_kind_idx" ON "Budget"("kind");
CREATE INDEX "Budget_userId_idx" ON "Budget"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
