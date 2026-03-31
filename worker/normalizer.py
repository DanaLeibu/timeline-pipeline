def normalize_events(events):
    events = [{k: v for k, v in e.items() if k != "_id"} for e in events]
    # Sort by timestamp
    events = sorted(events, key=lambda e: e["timestamp"])

    # Collapse identical events within 1 second
    collapsed = []
    for event in events:
        if (collapsed and 
            collapsed[-1]["type"] == event["type"] and 
            abs(event["timestamp"] - collapsed[-1]["timestamp"]) <= 1000):
            continue
        collapsed.append(event)

    # Flag PLAY without preceding PAUSE
    result = []
    last_type = None
    for event in collapsed:
        flags = []
        if event["type"] == "PLAY" and last_type not in (None, "PAUSE"):
            flags.append("implicit_recovery")
        event["flags"] = flags
        last_type = event["type"]
        result.append(event)

    return result
