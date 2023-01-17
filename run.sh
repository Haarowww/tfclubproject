#! /bin/bash
cd Backend
cd TFClub
./manage.py runserver &
cd ..
cd ..
cd Frontend
cd tfc
npm run start 