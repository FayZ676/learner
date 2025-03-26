from dataclasses import dataclass

from pydantic import BaseModel


@dataclass(eq=True, frozen=True)
class Answer(BaseModel):
    text: str
    is_correct: bool


@dataclass(eq=True, frozen=True)
class Question(BaseModel):
    text: str
    answers: list[Answer]


@dataclass(eq=True, frozen=True)
class Resource(BaseModel):
    title: str
    link: str


@dataclass(eq=True, frozen=True)
class LessonBase(BaseModel):
    topic: str
    description: str
    quiz: list[Question]


@dataclass(eq=True, frozen=True)  # type: ignore
class Lesson(LessonBase):
    id: str
    subject: str
    resources: list[Resource]
