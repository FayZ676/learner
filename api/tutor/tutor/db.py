import os
import json
from dataclasses import asdict

from dotenv import load_dotenv
from supabase import create_client, Client

from tutor.type import Lesson


class DB:
    def __init__(self):
        self.client = self.get_client()

    def get_lessons(self):
        response = self.client.table("lessons").select("*").execute()
        return [
            Lesson.model_validate_json(json.dumps(lesson.get("lesson", {})))
            for lesson in response.data
        ]

    def save_lesson(self, lesson: Lesson):
        self.client.table("lessons").insert(asdict(lesson)).execute()

    def get_lesson_by_date(self, date: str):
        if result := self.client.table("lessons").select("*").eq("date", date).execute().data:
            return Lesson.model_validate_json(
                json.dumps(
                    result[0]
                )
            )

    @staticmethod
    def get_client() -> Client:
        load_dotenv()
        url: str = os.environ.get("SUPABASE_URL") or ""
        key: str = os.environ.get("SUPABASE_KEY") or ""
        return create_client(url, key)
    
if __name__ == "__main__":
    print(DB().get_lesson_by_date("2025-03-20"))
