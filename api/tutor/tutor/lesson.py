import os
import json
import uuid
import requests
import logging
from dataclasses import asdict

from openai import OpenAI
from pydantic import BaseModel, ValidationError
from dotenv import load_dotenv

from tutor.type import LessonBase, Resource, Lesson, Question
from tutor.prompts import lesson_prompt, resources_prompt


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


load_dotenv()
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
perplexity_key = os.environ.get("PERPLEXITY_API_KEY")


MODEL = "gpt-4o-2024-08-06"


class LessonBaseResponse(BaseModel):
    lesson: LessonBase


class LessonResourcesResponse(BaseModel):
    resources: list[Resource]


def generate_lesson(subject: str, prev_topics: list[str]):
    lesson_base = generate_base(subject, prev_topics).lesson
    data = {
        "id": str(uuid.uuid4()),
        "subject": subject,
        "resources": [asdict(r) for r in get_resources(lesson_base.topic).resources],
    }
    data.update(**asdict(lesson_base))
    return parse_lesson(data)


def generate_base(
    message: str, prev_topics: list[str], system: str = ""
) -> LessonBaseResponse:
    completion = openai_client.beta.chat.completions.parse(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": lesson_prompt.substitute(
                    subject=message, prev_topics=prev_topics
                ),
            },
        ],
        response_format=LessonBaseResponse,
    )
    content = completion.choices[0].message.content
    return LessonBaseResponse.model_validate_json(content or "")


def get_resources(message: str):
    url = "https://api.perplexity.ai/chat/completions"
    payload = {
        "model": "sonar",
        "messages": [
            {
                "role": "user",
                "content": resources_prompt.substitute(topic=message),
                "return_images": True,
            },
        ],
        "max_tokens": 1000,
    }
    headers = {
        "Authorization": f"Bearer {perplexity_key}",
        "Content-Type": "application/json",
    }
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    data = response.json()["choices"][0]["message"]["content"]
    try:
        return LessonResourcesResponse.model_validate_json(data)
    except ValidationError:
        logger.error(f"Invalid Perplexity Response:\n{data}")
        return LessonResourcesResponse(resources=[])


def parse_lesson(lesson: dict) -> Lesson:
    quiz = [Question.model_validate_json(json.dumps(q)) for q in lesson.get("quiz", [])]
    l = Lesson.model_validate_json(json.dumps(lesson))
    return Lesson(
        id=l.id,
        subject=l.subject,
        topic=l.topic,
        description=l.description,
        resources=l.resources,
        quiz=quiz,
    )


if __name__ == "__main__":
    for r in get_resources("french greetings").resources:
        print(r)
