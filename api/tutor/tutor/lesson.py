import os
import json
import uuid
import requests
from dataclasses import asdict

from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

from tutor.type import LessonBase, Resource, Lesson, Question
from tutor.prompts import lesson_prompt, resources_prompt


load_dotenv()
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
perplexity_key = os.environ.get("PERPLEXITY_API_KEY")


MODEL = "gpt-4o-2024-08-06"


class LessonBaseResponse(BaseModel):
    lesson: LessonBase


class LessonResourcesResponse(BaseModel):
    resources: list[Resource]


def generate_lesson(subject: str, date: str, prev_topics: list[str]):
    lesson_base = generate_base(subject, date, prev_topics).lesson
    data = {
        "id": str(uuid.uuid4()),
        "subject": subject,
        "resources": [asdict(r) for r in get_resources(lesson_base.topic).resources],
    }
    data.update(**asdict(lesson_base))
    return parse_lesson(data)


def generate_base(
    message: str, date: str, prev_topics: list[str], system: str = ""
) -> LessonBaseResponse:
    completion = openai_client.beta.chat.completions.parse(
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
    url = "https://api.perplexity.ai/chat/completions"
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": resources_prompt.substitute(topic=message),
            },
        ],
        "max_tokens": 2000,
        "temperature": 0.2,
        "top_p": 0.9,
        "search_domain_filter": ["<any>"],
        "return_images": True,
        "return_related_questions": False,
        "search_recency_filter": "year",
        "top_k": 0,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 1,
        "response_format": {
            "type": "json_schema",
            "json_schema": {"schema": LessonResourcesResponse.model_json_schema()},
        },
        "web_search_options": {"search_context_size": "low"},
    }
    headers = {
        "Authorization": f"Bearer {perplexity_key}",
        "Content-Type": "application/json",
    }
    response = requests.request("POST", url, json=payload, headers=headers).json()
    return LessonResourcesResponse.model_validate_json(
        response["choices"][0]["message"]["content"]
    )


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
    print(generate_lesson("french greetings", "2025-03-22", []))
