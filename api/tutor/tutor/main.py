from fastapi import FastAPI

from tutor.lesson import generate_lesson
from tutor.db import DB


app = FastAPI()


@app.get("/lesson/get")
def lesson_get(date: str, subject: str):
    db = DB()
    if lesson := db.get_lesson_by_date(subject, date):
        return lesson
    lesson = generate_lesson(subject, date, db.get_subject_topics(subject))
    db.save_lesson(lesson)
    return lesson


@app.get("/subjects/get")
def subjects_get():
    return DB().get_subjects()


@app.post("/subjects/add")
def subjects_add(subject: str):
    return DB().save_subject(subject)
