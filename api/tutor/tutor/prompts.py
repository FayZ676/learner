from string import Template


lesson_prompt = Template(
    """
## Subject
$subject

## Previous Lessons
$prev_topics
                         
## Instructions
Return a lesson to assist in the study of the above subject. Make sure that the lesson is something new and not one of the previous lessons. The lesson should also focus on a singular and specific topic, not shouldn't be broad.

"""
)


resources_prompt = Template(
    """
## Topic
$topic.

## Instructions
Your task is to find and authenticate high quality resources that can assist in the research and learning of the above topic.

## Reponse Format
Respond with a JSON object containing a list of resources with the following fields:
- title
- link
Be VERY careful when formatting the links and titles. Any addition of extraneous double quotes will result in invalid JSON. Strictly follow the below example when formatting your response.
{
    "resources": [
        { 
            "title": "some resource", 
            "link": "https://someresourceurl.com"
        },
        { 
            "title": "some other resource", 
            "link": "https://someotherresourceurl.com"
        },
        ...
    ]
}

## Restrictions
DO NOT include any pre-amble or any post-amble. Do not include "```json ... ```" tickers or any kind of formatting. Simply return raw JSON as is.
"""
)
