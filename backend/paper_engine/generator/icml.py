# -*- coding:UTF-8 -*-
from bs4 import BeautifulSoup
import time
import requests
import re
import random
import sys
import io
from tqdm import tqdm

#sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf8')

base_url = "https://icml.cc/Conferences/{}/Schedule"
show_url = "https://icml.cc/Conferences/{}/Schedule?showEvent={}"

user_agents = ['Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20130406 Firefox/23.0', \
         'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:18.0) Gecko/20100101 Firefox/18.0', \
         'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533+ \
         (KHTML, like Gecko) Element Browser 5.0', \
         'IBM WebExplorer /v0.94', 'Galaxy/1.0 [en] (Mac OS X 10.5.6; U; en)', \
         'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)', \
         'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14', \
         'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) \
         Version/6.0 Mobile/10A5355d Safari/8536.25', \
         'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) \
         Chrome/28.0.1468.0 Safari/537.36', \
         'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; TheWorld)']

def getHtmlText(url):
    try:
        r = requests.get(url, timeout=30, headers={'user-agent':user_agents[random.randint(0, 9)]})
        # 如果状态码不是200 则应发HTTOError异常
        r.raise_for_status()
        # 设置正确的编码方式
        r.encoding = 'utf-8'
        return r.text
    except Exception as e:
        print(e)
        return "Something Wrong!"


def getSubContent(year, id):
    html = getHtmlText(show_url.format(year, id))
    # print(html)
    soup = BeautifulSoup(html, 'html.parser')
    abstract = soup.select('.abstractContainer')[0].getText()
    return abstract
    # papers = soup.find_all('div', attrs={'class': 'maincard narrower Poster'})


def getMainContent(year, cnt=60):
    html = getHtmlText(base_url.format(year))
    soup = BeautifulSoup(html, 'html.parser')
    papers = soup.find_all('div', attrs={'class': 'maincard narrower Poster'})
    paper_list = []
    for paper in tqdm(papers):
        title = paper.select(".maincardBody")[0].getText()
        author = paper.select(".maincardFooter")[0].getText()
        author = ','.join(author.split('·'))
        abstract = getSubContent(year, int(paper['id'].split('_')[-1]))
        paper_list.append({
            'title': title,
            'authors': author,
            'abstract': abstract,
        })
        if len(paper_list) >= cnt:
            break
    return paper_list


if __name__ == "__main__":
    getMainContent(2020)
    # getSubContent(2020, 3813)
