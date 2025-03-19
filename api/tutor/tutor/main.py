from datetime import datetime
from fastapi import FastAPI

from tutor.lesson import get_lesson
from tutor.db import DB


app = FastAPI()


@app.get("/lesson/get")
def lesson():
    db = DB()
    date = datetime.now().strftime("%Y-%m-%d")
    if lesson := db.get_lesson_by_date(date):
        return lesson
    lesson = get_lesson("Python data structures", date)
    db.save_lesson(lesson)
    return lesson
