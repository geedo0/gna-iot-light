# Setup the Frontend Static Host with S3 and CloudFront
There are some boiler plate resources we need to setup before CloudFormation can form our cloud.

## Upload the web assets
Let's get the frontend assets into S3. Part of this requires us to make a bucket to store them in.

```
aws s3 mb assets-bucket

# Update the client side javascript to point to your expected endpoint

aws s3 sync express-app/public s3:/<bucket-name>
```

## Create Route 53 and ACM infrastructure
1. Carve out a DNS name in Route 53 from the console by creating a Route 53 Hosted Zone.
2. Request an ACM certificate for that DNS name. This will be the certificate used by CloudFront.
3. Validate with DNS and create the record.
4. Cleanup the record when you get the certificate.
5. Similarly, perform the above for our API endpoint.
5. **LATER** once you create the cloudformation stack with the cloudfront distribution. You'll need to go back to Route53 and create the alias target to that distribution.

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
FrontEndBucket=assets-bucket
aws cloudformation create-stack --stack-name iot-light --template-body file://cloudformation/iot-light-stack.yml --parameters ParameterKey=ClientId,ParameterValue=$ClientId ParameterKey=TopicName,ParameterValue=$TopicName ParameterKey=FrontEndBucket,ParameterValue=$FrontEndBucket

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

# Setup the Node/Express application

## Setting up node
```
# Install the latest LTS version of node, not that junk on Ubuntu

# Install our dependencies Express, AWS SDK... 
cd express-app
npm install

# Update your IoT configuration (region, endpoint, topic)
vi package.json
```

## Run the server
```
npm run devstart
```

## Test the server
Go to the page [here](http://localhost:3000) and click the button.

# Setup the SAM Application
SAM isn't quite as polished so there's some monkey patching to get this working. At the end of this you'll have an API Gateway that will fire off a lambda to blink lights

```
cd sam-app

# Build the Lambda package, upload it to S3, and generate a cloudformation template
sam package --template-file template.yaml --s3-bucket <bucket name> --output-template-file package.yml

# Deploy the SAM App's cloudformation
sam deploy --template-file package.yml --stack-name sam-app --capabilities CAPABILITY_IAM

# Patch the stack to get our updated parameters
aws cloudformation update-stack --stack-name sam-app --use-previous-template --capabilities CAPABILITY_IAM --parameters ParameterKey=TopicName,ParameterValue=some/topic
```

After that stack finishes creating, we have to pop over to the API Gateway console and create a Custom Domain Name mapping. Pass in the API DNS name and the ACM certificate. Create a base path mapping to the Prod stage. The ACM certificate thing takes a long time to initialize.