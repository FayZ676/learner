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