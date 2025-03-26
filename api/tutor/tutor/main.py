from fastapi import FastAPI
from pydantic import BaseModel

from tutor.lesson import generate_lesson


app = FastAPI()


class LessonRequest(BaseModel):
    subject: str
    previousSubjects: list[str]


@app.post("/lesson/generate")
def lesson_get(request: LessonRequest):
    return generate_lesson(request.subject, request.previousSubjects)
