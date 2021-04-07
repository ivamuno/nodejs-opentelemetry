#!/bin/sh
set -e

cmd="$@"

until [ `echo "quit" | telnet ${DB_HOST} ${DB_PORT} | grep "Connected" | wc -l` -gt 0 ];
do
  >&2 echo "waiting for ${DB_HOST} ${DB_PORT} to wake up"
  sleep 5
done

>&2 echo "storage has woke up"
exec $cmd
