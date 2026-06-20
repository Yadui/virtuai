-- Drop old Stripe columns and add Razorpay columns to UserSubscription
-- We recreate the table to avoid complex ALTER TABLE chains

-- Rename old table to backup
ALTER TABLE "UserSubscription" RENAME TO "UserSubscription_stripe_backup";

-- Create new table with Razorpay fields
CREATE TABLE "UserSubscription" (
    "id"                  TEXT NOT NULL,
    "userId"              TEXT NOT NULL,
    "plan"                TEXT NOT NULL DEFAULT 'Free',
    "razorpay_order_id"   TEXT,
    "razorpay_payment_id" TEXT,
    "activated_at"        TIMESTAMP(3),

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX "UserSubscription_userId_key"              ON "UserSubscription"("userId");
CREATE UNIQUE INDEX "UserSubscription_razorpay_order_id_key"   ON "UserSubscription"("razorpay_order_id");
CREATE UNIQUE INDEX "UserSubscription_razorpay_payment_id_key" ON "UserSubscription"("razorpay_payment_id");

-- Migrate existing rows as Free plan (no payment data to keep)
INSERT INTO "UserSubscription" ("id", "userId", "plan")
SELECT "id", "userId", 'Free'
FROM "UserSubscription_stripe_backup";

-- Drop backup
DROP TABLE "UserSubscription_stripe_backup";
