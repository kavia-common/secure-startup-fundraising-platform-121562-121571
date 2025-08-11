#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-startup-fundraising-platform-121562-121571/company_data_room_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

