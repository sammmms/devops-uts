#!/bin/bash
cd "$(dirname "$0")"
alembic upgrade head
