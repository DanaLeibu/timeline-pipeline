import time
from pymongo import MongoClient
from normalizer import normalize_events

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "timeline"
POLL_INTERVAL = 5  # seconds

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
events_col = db["events"]
timelines_col = db["timelines"]


def process():
    session_ids = events_col.distinct("sessionId", {"processed": False})

    for session_id in session_ids:
        raw_events = list(events_col.find({"sessionId": session_id, "processed": False}))

        normalized = normalize_events(raw_events)

        timelines_col.update_one(
            {"sessionId": session_id},
            {"$set": {
                "sessionId": session_id,
                "events": normalized,
                "processedAt": int(time.time() * 1000)
            }},
            upsert=True
        )

        event_ids = [e["_id"] for e in raw_events]
        events_col.update_many(
            {"_id": {"$in": event_ids}},
            {"$set": {"processed": True}}
        )

        print(f"Processed session {session_id} — {len(normalized)} events")


if __name__ == "__main__":
    print("Worker started, polling every 5 seconds...")
    while True:
        try:
            process()
        except Exception as e:
            print(f"Error processing events: {e}")
        time.sleep(POLL_INTERVAL)
