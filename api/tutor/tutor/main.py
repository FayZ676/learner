from datetime import datetime
from fastapi import FastAPI

from tutor.lesson import get_lesson
from tutor.db import DB


app = FastAPI()


@app.get("/lesson/get")
def lesson():
    db = DB()
    date = datetime.now().strftime("%Y-%m-%d")
    subject = "Python data structures and algorithms. Particularly for interview style and leetcode style questions."
    if lesson := db.get_lesson_by_date(date):
        return lesson
    lesson = get_lesson(subject, date)
    db.save_lesson(lesson)
    return lesson
