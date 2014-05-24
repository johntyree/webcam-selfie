#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import division, print_function

# import sys
import os
import logging
logger = logging.getLogger(__name__)
# import itertools as it

from bottle import route, run, static_file, request


def mk_filename(prefix, ext):
    i = 0
    fmt = "upload/{prefix}_{i}.{ext}"
    while i < 1000:
        fn = fmt.format(**locals())
        if not os.path.exists(fn):
            return fn
        i += 1
    raise RuntimeError("Ain't no filenames available")


@route('/', method='GET')
def home():
    return static_file('index.html', root='.')


@route('/<filename:path>', method='GET')
def serve_file(filename):
    return static_file(filename, root='.')


@route('/upload', method='POST')
def save_file():
    try:
        filename = mk_filename("video", "webm")
        request.POST.blob.save(filename)
        return filename
    except Exception as e:
        msg = "{0.__class__.__name__}: {0}".format(e)
        logger.warning(msg)

if __name__ == '__main__':
    run(host='localhost', debug=True)
