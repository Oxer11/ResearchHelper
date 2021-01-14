import uuid
from django.db import models

# Create your models here.
class Paper(models.Model):
    title = models.CharField(max_length=1000)
    year = models.IntegerField()
    abstract = models.TextField(max_length=100000)
    authors = models.CharField(max_length=1000)
    conf = models.CharField(max_length=100)
    url = models.URLField()
    scanned = models.BooleanField()
    todo = models.BooleanField()
    read = models.BooleanField()
    never = models.BooleanField()

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=1000)
    deadline = models.DateField()
    done = models.BooleanField()
    todo = models.BooleanField()
    urgent = models.BooleanField()
    important = models.BooleanField()

    def __str__(self):
        return self.title
