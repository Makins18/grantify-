import sys
import os
from pathlib import Path

# Mocking internal dependencies to test filtering logic
class MockLogger:
    def info(self, msg): print(f"INFO: {msg}")
    def error(self, msg): print(f"ERROR: {msg}")
    def debug(self, msg): print(f"DEBUG: {msg}")

def test_filtering():
    title_1 = "Scholarship for Nigerians 2026"
    summary_1 = "Full funding for Nigerian students."
    
    title_2 = "Grant for South African Tech"
    summary_2 = "Available for Cape Town based startups."
    
    title_3 = "Pan-African Fellowship"
    summary_3 = "Open to all Africans including Nigerians."

    def apply_logic(title, summary):
        scholarship = {
            "title": title,
            "summary": summary,
            "location": "Nigeria" if "nigeria" in title.lower() or "nigeria" in summary.lower() else "Varies"
        }
        text_to_check = (scholarship["title"] + " " + scholarship["summary"]).lower()
        if "nigeria" in text_to_check or "nigerian" in text_to_check:
            return scholarship
        return None

    res1 = apply_logic(title_1, summary_1)
    res2 = apply_logic(title_2, summary_2)
    res3 = apply_logic(title_3, summary_3)

    assert res1 is not None, "Failed to match Nigerians 2026"
    assert res1["location"] == "Nigeria"
    
    assert res2 is None, "Should have filtered South African Tech"
    
    assert res3 is not None, "Should match Pan-African because of summary mention"
    assert res3["location"] == "Nigeria"

    print("✅ Filtering logic test passed!")

if __name__ == "__main__":
    test_filtering()
