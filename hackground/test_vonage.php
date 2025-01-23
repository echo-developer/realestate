<?php
require 'vendor/autoload.php';

use Vonage\Client;
use Vonage\Client\Credentials\Basic;
use Vonage\Messages\WhatsApp\Text;

$basic = new Basic('your_api_key', 'your_api_secret');
$client = new Client($basic);

try {
    $message = new Text(
        to: '+1234567890', // Replace with your phone number
        from: 'YourBrandName',
        text: 'Test message from WhatsApp API!'
    );

    $response = $client->send($message);
    print_r($response);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
