#!/bin/bash

# Update and upgrade packages
sudo apt-get update
sudo apt-get upgrade -y

# Add line to /boot/config.txt
echo "dtparam=spi=on" | sudo tee -a /boot/config.txt

# Install necessary packages
sudo apt-get install -y python3-dev python3-pip
sudo pip3 install spidev
sudo pip3 install mfrc522
sudo pip install "python-socketio[client]"
sudo pip install python-dotenv

reboot
