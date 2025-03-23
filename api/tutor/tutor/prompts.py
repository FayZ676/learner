from string import Template


lesson_prompt = Template(
    """
## Date
$date

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
$topic

Return 3 to 5 resources for the above Topic. Please output a JSON object containing a list of resources with the following fields:
- title
- link
- image

Do not include any pre-amble, any post-amble. Do not include the "```json ... ```" ticks either. Simply return the raw JSON as is.
"""
)