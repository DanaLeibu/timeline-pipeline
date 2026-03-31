# Timeline Normalization Service


Build a clean session timeline from raw video events, handling delays, duplicates and ordering issues.

## Architecture

The system is built from two separate services that communicate through MongoDB:

- **NestJS API** — the server. Receives raw events, validates them, saves to MongoDB, and serves the normalized timelines.
- **Python Worker** — runs in the background. Polls MongoDB for new events, normalizes them, and writes the clean timeline back to MongoDB.

### Flow

1. Client sends a raw event to NestJS (`POST /events`)
2. NestJS validates it and saves it to the `events` collection with `processed: false`
3. Python worker checks every 5 seconds for unprocessed events
4. When it finds new events, it sorts them, removes duplicates, collapses near-identical ones, and flags state issues
5. It saves the clean timeline to the `timelines` collection and marks the events as `processed: true`
6. When the client asks for a timeline (`GET /sessions/:id/timeline`), NestJS reads from the `timelines` collection and returns it

### Why MongoDB
I chose MongoDB because both NestJS and Python have solid libraries for it (Mongoose and PyMongo), and the event data is document-based — no complex relations between tables, just events grouped by session. It also made sense as the shared layer between the two services without needing a message queue.

## Endpoints

| Method | Path | What it does |
|--------|------|-------------|
| POST | /events | Receives a raw event, validates it, checks for duplicates and inconsistency, saves to DB |
| GET | /sessions/:id/timeline | Returns the normalized timeline for a specific session |
| GET | /health | Returns `{ status: "ok" }` if the server is running |
| GET | /metrics | Returns counters: how many events were ingested, how many duplicates ignored, how many flagged inconsistent |

## Normalization Rules
1. Duplicate `eventId` — ignored on ingestion (NestJS)
2. If `timestamp` and `clientTimestamp` differ by more than 10 seconds — flagged as `inconsistent` (NestJS)
3. Events sorted by `timestamp` regardless of arrival order (Python)
4. Two events with the same type within 1 second — collapsed into one (Python)
5. If `PLAY` happens without a preceding `PAUSE` — flagged as `implicit_recovery` (Python)


## Tradeoffs & Assumptions

- **Duplicate check with findOne**: I check for duplicate `eventId` using a database query before saving. A unique index on `eventId` would catch it at the DB level, but `findOne` gives me control to count the duplicate in metrics before rejecting it.
- **In-memory metrics**: The counters (ingested, duplicates, inconsistent) live in memory. They reset when the server restarts. For production I would store them in the database, but for this scope it keeps things simple.
- **Polling instead of message queue**: The worker polls MongoDB every 5 seconds. A message queue (like RabbitMQ) would notify the worker immediately when a new event arrives, but it adds another service to manage. Polling is simple and good enough here.
- **MongoDB as the bridge**: Both services read and write to the same database. No extra protocol or communication layer needed. Simple and reliable for a small system.
- **Splitting normalization between NestJS and Python**: Deduplication and inconsistency are checked on ingestion. Sorting, collapsing, and state recovery run in the worker because they need to see all events of a session at once.

## Testing

**NestJS unit tests** — test the service logic: duplicate rejection, inconsistency flagging, valid event saving, timeline retrieval, health and metrics.

## Run
### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB running locally on port 27017

### API
```bash
cd api
npm install
npm run start:dev

## If I Had 1 More Day, I Would...
add a Docker file and add a webhook (instead of client polling)