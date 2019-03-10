import boto3
import os

def lambda_handler(event, context):
  print('Started blink handler.')

  topic = os.environ['IOT_TOPIC']
  print('Publishing to topic: ' + topic)

  iot = boto3.client('iot-data')
  response = iot.publish(topic=topic)
  print(response)
  if response['ResponseMetadata']['HTTPStatusCode'] == 200:
    print('HTTP 200: Success')
    return {
      'statusCode': 200,
      'headers': {
        'Access-Control-Allow-Origin': '*'
      }
    }
  else:
    print('Failed response.')
    return {'statusCode': 500}
