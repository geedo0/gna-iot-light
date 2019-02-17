# Setup the Raspberry Pi

## Python Dependencies
```
# On the Raspberry Pi
git clone git@github.com:geedo0/iot-light.git
pip3 install -r requirements.txt
```

## Setup AWS resources

### Raspberry Pi stack
```
ClientId=RaspberryPi
TopicName=lights/home
aws cloudformation create-stack --stack-name iot-light --template-body file://cloudformation/iot-light-stack.yml --parameters ParameterKey=ClientId,ParameterValue=$ClientId ParameterKey=TopicName,ParameterValue=$TopicName

# Take note of your IOT endpoint
aws iot describe-endpoint
{
    "endpointAddress": "<your endpoint>.iot.us-east-1.amazonaws.com"
}
```
Once the stack is created, we need to manually create the device certificate.
1. Go to the AWS IoT Console
2. Create a new certificate for our Raspberry Pi Thing
3. Activate the certificate
4. Attach the policy from the CloudFormation template
5. Download the resulting certificate related files: ${hex-id}-certificate.pem.crt, ${hex-id}-private.pem.key, ${hex-id}-public.pem.key, and root-CA.crt
6. SCP these over to the Raspberry Pi
7. Update the start.sh script

### IoT Button
1. Setup the IoT Dash button using the Android App. This will create the certificate and publish button clicks to the button's IoT topic.
2. Remove whatever IoT rule you were forced to create in that process.
3. Create the CloudFormation stack below
```
# This is the 16-digit Serial number underneath the button
ButtonSerialNumber=DEADBEEFCAFEFACE
TopicName=lights/home
aws create-stack --stack-name iot-light-button --template-body file://cloudformation/iot-button.yml --parameters ParameterKey=ButtonSerialNumber,ParameterValue=$ButtonSerialNumber ParameterKey=TopicName,ParameterValue=$TopicName --capabilities CAPABILITY_IAM
```

## Test 
```
sudo ./start.sh

# Publish a message to the topic from the IoT console or by pressing the button
# Observe the blinking lights
```

## Start it on boot
```
sudo vi /etc/rc.local

# Add this snippet
sudo /home/pi/iot-light/start.sh &
```

# Setup the web application

## Setting up node
```
# Install the latest LTS version of node, not that junk on Ubuntu

# Install our dependencies Express, AWS SDK... 
cd express-app
npm install

# Update your IoT configuration (region, endpoint, topic)
vi package.json
```
