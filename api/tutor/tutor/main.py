from datetime import datetime
from pathlib import Path
from fastapi import FastAPI

from tutor.lesson import get_lesson
from tutor.db import save_lesson, get_lesson_by_date


app = FastAPI()


@app.get("/lesson/get")
def lesson():
    path = f"{Path(__file__).parent}/db.json"
    date = datetime.now().strftime("%Y-%m-%d")
    if lesson := get_lesson_by_date(date, path):
        return lesson
    lesson = get_lesson("Python data structures", date)
    save_lesson(lesson, path)
    return lesson
