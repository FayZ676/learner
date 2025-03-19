FROM python:3.12-slim

WORKDIR /app

COPY tutor/ /app/

RUN pip install .

EXPOSE 8000

CMD ["uvicorn", "tutor.main:app", "--host", "0.0.0.0", "--port", "8000"]