import os
import json
from dataclasses import asdict

from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

from tutor.type import Lesson, LessonBase, Resource
from tutor.prompts import lesson_prompt


load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


MODEL = "gpt-4o-2024-08-06"


class LessonBaseResponse(BaseModel):
    lesson: LessonBase


class LessonResourcesResponse(BaseModel):
    resources: list[Resource]


def get_lesson(subject: str, date: str, prev_topics: list[str]):
    lesson_base = get_base(subject, date, prev_topics).lesson
    lesson = Lesson(
        **asdict(lesson_base), resources=get_resources(lesson_base.topic).resources
    )
    return lesson


def get_base(
    message: str, date: str, prev_topics: list[str], system: str = ""
) -> LessonBaseResponse:
    completion = client.beta.chat.completions.parse(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": lesson_prompt.substitute(
                    subject=message, date=date, prev_topics=prev_topics
                ),
            },
        ],
        response_format=LessonBaseResponse,
    )
    content = completion.choices[0].message.content
    return LessonBaseResponse.model_validate_json(content or "")


def get_resources(message: str, system: str = "") -> LessonResourcesResponse:
    response = client.responses.create(
        model=MODEL,
        input=[
            {"role": "system", "content": system},
            {"role": "user", "content": message},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "resources",
                "schema": {
                    "type": "object",
                    "properties": {
                        "resources": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "link": {"type": "string"},
                                },
                                "required": ["title", "link"],
                                "additionalProperties": False,
                            },
                        }
                    },
                    "required": ["resources"],
                    "additionalProperties": False,
                },
                "strict": True,
            }
        },
        tools=[
            {
                "type": "web_search_preview",
                "user_location": {"type": "approximate"},
                "search_context_size": "medium",
            }
        ],
        temperature=1,
        max_output_tokens=2048,
        top_p=1,
        store=True,
    )
    return LessonResourcesResponse.model_validate_json(response.output_text)
