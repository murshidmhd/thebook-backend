# 1️⃣ Base image
FROM python:3.12-slim

# 2️⃣ Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3️⃣ Set work directory
WORKDIR /app

# 4️⃣ Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5️⃣ Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 6️⃣ Copy project files
COPY . .

# 7️⃣ Collect static (optional now, required later)
# RUN python manage.py collectstatic --noinput

# 8️⃣ Expose port (Gunicorn will use this)
EXPOSE 8000

# 9️⃣ Start Gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
