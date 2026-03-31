from normalizer import normalize_events

def test_sorts_by_timestamp():
    events = [
        {"eventId": "e2", "type": "PAUSE", "timestamp": 2000},
        {"eventId": "e1", "type": "PLAY", "timestamp": 1000},
    ]
    result = normalize_events(events)
    assert result[0]["eventId"] == "e1"
    assert result[1]["eventId"] == "e2"

def test_collapses_identical_events_within_1_second():
    events = [
        {"eventId": "e1", "type": "PLAY", "timestamp": 1000},
        {"eventId": "e2", "type": "PLAY", "timestamp": 1500},
    ]
    result = normalize_events(events)
    assert len(result) == 1

def test_flags_implicit_recovery():
    events = [
        {"eventId": "e1", "type": "PLAY", "timestamp": 1000},
        {"eventId": "e2", "type": "PLAY", "timestamp": 5000},
    ]
    result = normalize_events(events)
    assert "implicit_recovery" in result[1]["flags"]
