from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 10})
def send_welcome_email(self, email, username):
    subject = "Welcome to The Book Store 📚"
    message = f"""
Hi {username},

Welcome to The Book Store!

Your account has been created successfully.
You can now explore books and place orders.

Happy reading 📖
Team The Book Store
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
