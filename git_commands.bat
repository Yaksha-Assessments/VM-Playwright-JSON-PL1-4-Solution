@echo off
REM Display the current status of the repository
git status

REM Add all changes to the staging area
git add .

REM Commit the changes with a message
git commit -m "First commit"

REM Push the changes to the remote repository
git push

