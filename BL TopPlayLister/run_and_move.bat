@echo off
node .
echo Waiting...
CALL :sleep
move topplays.json C:\Users\%username%\BSManager\BSInstances\1.29.1\Playlists

:sleep
ping 127.0.0.1 -n 2 -w 4000 > NUL