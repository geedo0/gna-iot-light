#!/bin/bash
IOT_ENDPOINT=REDACTED.iot.us-east-1.amazonaws.com
CLIENT_ID=pi
TOPIC_ID=lights/pi

ROOT_DIR=/home/pi
ROOT_CA=${ROOT_DIR}/root-CA.crt
CERTIFICATE=${ROOT_DIR}/REDACTED-certificate.pem.crt
PRIVATE_KEY=${ROOT_DIR}/REDACTED-private.pem.key

${ROOT_DIR}/iot-light/iot-light.py -e ${IOT_ENDPOINT} -r ${ROOT_CA} -c ${CERTIFICATE} -k ${PRIVATE_KEY} -id ${CLIENT_ID} -t ${TOPIC_ID} -m subscribe
