-- CreateTable
CREATE TABLE "events_participants" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_event" TEXT NOT NULL,

    CONSTRAINT "events_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
