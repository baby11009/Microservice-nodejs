# Microservice-nodejs

# Needed

Create .env file for each customer, product, shopping
.env contains there following fields :

<!-- App secret to enscrypt and decrypt jst and customer ps -->
<!-- Must be similar in all service -->
APP_SECRET

<!-- URI to connect your MongoDB -->
MONGODB_URI

<!-- MSG queue url to connect to your RabbitMQ -->
<!-- Can use RabbitMQ default url ('amqp://localhost:5672') if don't use any config for your RabbitMQ service -->
MSG_QUEUE_URL

<!-- Name to exchange between RabbitMQ channel connection -->
<!-- Must be similar in all service -->
EXCHANGE_NAME

<!-- Port to run service -->
<!-- Difference on each service -->
PORT

<!-- URL of your gateway -->
BASE_URL
