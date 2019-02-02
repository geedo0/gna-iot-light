# Setup

## Python Dependencies
```
# On the Raspberry Pi
git clone git@github.com:geedo0/iot-light.git
pip3 install -r requirements.txt
```

## Setup AWS resources
```
ClientId=RaspberryPi
TopicName=lights/home
aws cloudformation create-stack --stack-name iot-light --template-body file://cloudformation/iot-light-stack.yml --parameters ParameterKey=ClientId,ParameterValue=$ClientId,ParameterKey=TopicName,ParameterValue=$TopicName

# Take note of your IOT endpoint
aws iot describe-endpoint
{
    "endpointAddress": "<your endpoint>.iot.us-east-1.amazonaws.com"
}
```
Once the stack is created, we need to manually create the device certificate.
1. Go to the AWS IoT Console
2. Create a new certificate for our Raspberry Pi Thing
3. Download the resulting certificate related files: ${hex-id}-certificate.pem.crt, ${hex-id}-private.pem.key, ${hex-id}-public.pem.key, and root-CA.crt
4. SCP these over to the Raspberry Pi
5. Update the start.sh script

## Start it on reboot
```
crontab -e
@reboot /path/to/start.sh &
```