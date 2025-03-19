import os
import json

from tutor.type import Lesson


def load_db(db_path: str) -> list[Lesson]:
    with open(db_path, "r") as f:
        if os.path.getsize(db_path) == 0:
            return []
        content = json.load(f)
        return (
            [Lesson.model_validate_json(json.dumps(lesson)) for lesson in content]
            if content
            else []
        )


def save_lesson(lesson: Lesson, db_path: str):
    lessons = load_db(db_path)
    lessons.append(lesson)
    with open(db_path, "w") as f:
        f.write(json.dumps([l.model_dump() for l in lessons]))


def get_lesson_by_date(date: str, db_path: str):
    lessons = load_db(db_path)
    return next((l for l in lessons if l.date == date), None)
