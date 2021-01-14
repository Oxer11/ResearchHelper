from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .generator import icml
from .models import Paper, Event
from datetime import datetime

tags = ['scanned', 'todo', 'read', 'never']
tags_event = ['important', 'todo', 'urgent', 'done']


# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

@csrf_exempt 
def import_paper(request):
    try:
        config = json.loads(request.body)
        conf = config.get('conf', 'icml')
        year = int(config.get('year', '2020'))
        if conf == 'icml':
            paper_list = icml.getMainContent(year)
        for paper in paper_list:
            p = Paper(title=paper['title'], abstract=paper['abstract'], authors=paper['authors'],
                year=year, conf=conf, url=paper.get('url', ''), scanned=False, todo=False, read=False, never=True)
            p_exists = Paper.objects.filter(title=paper['title'], abstract=paper['abstract'], authors=paper['authors'])
            if not p_exists:
                p.save()
                print(p.title)
        return myJsonResponse(json.dumps({'message': 'Success'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))


def get_paper(request):
    ps = list(Paper.objects.all())
    res = []
    for p in ps:
        dic = p.__dict__
        dic.pop('_state')
        dic['key'] = dic.pop('id')
        authors = dic.pop('authors').split(',')
        dic['authors'] = ', '.join([x.strip() for x in authors])
        dic['tags'] = []
        for tag in tags:
            if dic.pop(tag):
                dic['tags'].append(tag)
        res.append(dic)
    ps = json.dumps({'results': res})
    return HttpResponse(ps)


def myJsonResponse(json_data):
    response = HttpResponse(json_data)
    response['Access-Control-Allow-Origin'] = 'http://127.0.0.1:8000'
    response['Access-Control-Allow-Methods'] = 'POST,GET,OPTIONS'
    response['Access-Control-Max-Age'] = '2000'
    response['Access-Control-Allow-Headers'] = '*'
    response['Access-Control-Allow-Credentials'] = True
    return response

@csrf_exempt 
def add_paper(request):
    try:
        paper = json.loads(request.body)
        title = paper.get('title', 'test')
        authors = paper.get('authors', 'null')
        abstract = paper.get('abstract', 'null')
        url = paper.get('abstract', '')
        conf = paper.get('conf', 'icml')
        year = int(paper.get('year', '2020'))
        p = Paper(title=title, abstract=abstract, authors=authors,
            year=year, conf=conf, url=url, scanned=False, todo=False, read=False, never=True)
        p_exists = Paper.objects.filter(title=title, abstract=abstract, authors=authors)
        if not p_exists:
            p.save()
            print(p.title)
            return myJsonResponse(json.dumps({'message': 'Success'}))
        else:
            return myJsonResponse(json.dumps({'message': 'Paper already exists.'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))
    
    
@csrf_exempt 
def delete_paper(request):
    try:
        paper = json.loads(request.body)
        id = paper.get('id', 0)
        p = Paper.objects.get(id=id)
        p.delete()
        print(p.title)
        return myJsonResponse(json.dumps({'message': 'Success'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))


@csrf_exempt 
def edit_paper(request):
    try:
        paper = json.loads(request.body)
        id = paper.get('id', 0)
        title = paper.get('title', 'test')
        authors = paper.get('authors', 'null')
        abstract = paper.get('abstract', 'null')
        url = paper.get('abstract', '')
        conf = paper.get('conf', 'icml')
        year = int(paper.get('year', '2020'))
        _tags = paper.get('tags', [])
        p = Paper.objects.get(id=id)
        p.title = title
        p.authors = authors
        p.abstract = abstract
        p.url = url
        p.conf = conf
        p.year = year
        for tag in tags:
            setattr(p, tag, tag in _tags)
        p.save()
        print(p.title)
        return myJsonResponse(json.dumps({'message': 'Success'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))


@csrf_exempt 
def add_event(request):
    try:
        event = json.loads(request.body)
        title = event.get('title', 'test')
        deadline = datetime.strptime(event.get('deadline', '2020/01/01'), '%Y/%m/%d')
        p = Event(title=title, deadline=deadline, important=False, done=False, urgent=False, todo=True)
        p_exists = Event.objects.filter(title=title, deadline=deadline)
        if not p_exists:
            p.save()
            print(p.title)
            return myJsonResponse(json.dumps({'message': 'Success'}))
        else:
            return myJsonResponse(json.dumps({'message': 'Paper already exists.'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))


def get_event(request):
    ps = list(Event.objects.all())
    res = []
    for p in ps:
        dic = p.__dict__
        dic.pop('_state')
        dic['key'] = dic.pop('id')
        dic['deadline'] = dic['deadline'].strftime('%Y/%m/%d')
        dic['tags'] = []
        for tag in tags_event:
            if dic.pop(tag):
                dic['tags'].append(tag)
        res.append(dic)
    ps = json.dumps({'results': res})
    return HttpResponse(ps)


@csrf_exempt 
def edit_event(request):
    try:
        event = json.loads(request.body)
        id = event.get('id', 0)
        title = event.get('title', 'test')
        deadline = datetime.strptime(event.get('deadline', '2020/01/01'), '%Y/%m/%d')
        _tags = event.get('tags', [])
        p = Event.objects.get(id=id)
        p.title = title
        p.deadline = deadline
        for tag in tags_event:
            setattr(p, tag, tag in _tags)
        p.save()
        print(p.title)
        return myJsonResponse(json.dumps({'message': 'Success'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))


@csrf_exempt 
def delete_event(request):
    try:
        event = json.loads(request.body)
        id = event.get('id', 0)
        p = Event.objects.get(id=id)
        p.delete()
        print(p.title)
        return myJsonResponse(json.dumps({'message': 'Success'}))
    except Exception as e:
        return myJsonResponse(json.dumps({'message': 'Error: {}'.format(e)}))