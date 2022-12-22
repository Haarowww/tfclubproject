#! /bin/bash
chmod +x run.sh
cd Backend
cd TFClub
python3.10 -m pip install virtualenv
python3.10 -m virtualenv -p `which python3.10` venv
source venv/bin/activate
pip install -r requirements.txt
chmod +x manage.py
./manage.py makemigrations
./manage.py migrate
cd ..
cd ..
cd Frontend
cd tfc
npm install --force
cd ..
cd ..