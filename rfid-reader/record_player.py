#!/usr/bin/env python

import os
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import socketio
from dotenv import load_dotenv

load_dotenv()

with socketio.SimpleClient() as sio:
    sio.connect(os.getenv("MUSIC_PLAYER_URL"))

    while True:
        try:
            reader = SimpleMFRC522()

            while True:
                print("Waiting for record to scan...")
                rfid = reader.read()[0]
                print("The ID for this card is:", rfid)

                message = {rfidCode: rfid, sonosRoom: os.getenv("SONOS_ROOM")}
                sio.emit("playRecord", message)

        except Exception as e:
            print(e)
            pass

        finally:
            print("Cleaning up GPIO...")
            GPIO.cleanup()
