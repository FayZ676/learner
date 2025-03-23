import os
import json
from dataclasses import asdict

from dotenv import load_dotenv
from supabase import create_client, Client

from tutor.type import Lesson, Question, Resource


class DB:
    def __init__(self):
        self.client = self.get_client()

    def get_lessons(self, subject: str = ""):
        response = (
            self.client.table("lessons").select("*").eq("subject", subject).execute()
        )
        return [
            Lesson.model_validate_json(json.dumps(lesson.get("lesson", {})))
            for lesson in response.data
        ]

    def get_subject_topics(self, subject: str):
        response = (
            self.client.table("lessons")
            .select("topic")
            .eq("subject", subject)
            .execute()
        )
        return [str(dict(topic).get("topic")) for topic in response.data]

    def get_subjects(self):
        response = self.client.table("subjects").select("subject").execute()
        return [str(dict(topic).get("subject")) for topic in response.data]

    def save_subject(self, subject: str):
        self.client.table("subjects").insert({"subject": subject}).execute()

    def delete_subject_topics(self, subject: str):
        self.client.table("subjects").delete().eq("subject", subject).execute()
        self.client.table("lessons").delete().eq("subject", subject).execute()

    def save_lesson(self, lesson: Lesson):
        self.client.table("lessons").insert(asdict(lesson)).execute()

    def get_lesson_by_date(self, subject: str, date: str):
        if (
            result := self.client.table("lessons")
            .select("*")
            .eq("date", date)
            .eq("subject", subject)
            .execute()
            .data
        ):
            return self.parse_lesson(result[0])

    @staticmethod
    def get_client() -> Client:
        load_dotenv()
        url: str = os.environ.get("SUPABASE_URL") or ""
        key: str = os.environ.get("SUPABASE_KEY") or ""
        return create_client(url, key)

    @staticmethod
    def parse_lesson(lesson: dict) -> Lesson:
        quiz = [
            Question.model_validate_json(json.dumps(q)) for q in lesson.get("quiz", [])
        ]
        l = Lesson.model_validate_json(json.dumps(lesson))
        return Lesson(
            id=l.id,
            date=l.date,
            subject=l.subject,
            topic=l.topic,
            description=l.description,
            resources=l.resources,
            quiz=quiz,
        )


if __name__ == "__main__":
    print(DB().delete_subject_topics("french greetings"))
