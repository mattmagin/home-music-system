#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import socketio
from time import sleep

sonosRoom = "Living Room"

with socketio.SimpleClient() as sio:
    sio.connect("http://192.168.1.243:5004")
    while True:
        try:
            reader = SimpleMFRC522()

            while True:
                print("Waiting for record to scan...")
                rfid = reader.read()[0]
                print("The ID for this card is:", rfid)

                message = {"rfidCode": rfid, "sonosRoom": "Living Room"}
                sio.emit("playRecord", message)
                sleep(3)
        except Exception as e:
            print(e)
            pass

        finally:
            print("Cleaning up GPIO...")
            GPIO.cleanup()
