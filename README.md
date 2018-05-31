# Chasqui
messenger service for app communication.
## Setup

```bash
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate
```

## Usage
You can {create,get,update,delete} messenger for communication 
### Create
###### request
```bash
curl -X POST http://localhost:3000/messengers --data '{"data": {"id": "11", "type": "messengers", "attributes": {}}}'
```

###### response
```json
{
  "data": {
    "id": "11",
    "type": "messengers",
    "attributes": {
      "content": {}
    }
  }
}
```

### Get
###### request
```bash
curl http://localhost:3000/messengers/11
```

###### response
```json
{
  "data": {
    "id": "11",
    "type": "messengers",
    "attributes": {
      "content": {}
    }
  }
}
```

### Update
###### request
```bash
curl -X PATCH http://localhost:3000/messengers/11 --data '{"data": {"id": "11", "type": "messengers", "attributes": {"content": {"access_token": "access_token"}}}}'
```

###### response
```json
{
  "data": {
    "id": "11",
    "type": "messengers",
    "attributes": {
      "content": {
        "access_token": "access_token"
      }
    }
  }
}
```

### Delete
###### request
```bash
curl -X DELETE http://localhost:3000/messengers/11
```

###### response
```javascript
{}
```


## Deploy

### AWS config
configure the access_key_id, access_key, and the region
```bash
aws configure
```

```bash
sls deploy
```