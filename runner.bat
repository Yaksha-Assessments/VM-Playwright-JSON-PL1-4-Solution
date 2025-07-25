@echo off

REM Path to your batch file to execute
set "batch_file_path=git_commands.bat"

REM Interval in seconds (e.g., 60 seconds = 1 minute)
set interval=60

:loop
echo Executing batch file at %DATE% %TIME%
call "%batch_file_path%"

REM Waiting specified interval before next execution
timeout /t %interval% /nobreak > NUL

goto loop
