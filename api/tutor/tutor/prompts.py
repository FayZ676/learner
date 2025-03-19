from string import Template


lesson_prompt = Template(
    """
## Date
$date

## Subject
$subject
                         
## Instructions
Return a lesson to assist in the study of the above subject. The lesson should focus on a singular and specific topic. It shouldn't be broad.
"""
)