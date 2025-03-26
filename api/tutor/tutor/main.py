from fastapi import FastAPI

from tutor.lesson import generate_lesson


app = FastAPI()


@app.get("/lesson/get")
def lesson_get(date: str, subject: str, prev_topics: list[str]):
    return generate_lesson(subject, date, prev_topics)
